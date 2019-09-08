"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
const AuriaEventResponse_1 = require("../../../http/AuriaEventResponse");
const RowModel_1 = require("../../../database/structure/rowModel/RowModel");
const QueryFilter_1 = require("../../../database/dataQuery/QueryFilter");
class DataSyncListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "DataSync");
        /**
         * [Action]: Model Updated
         * ------------------------
         * Event triggered function that will send to all EventStream responses
         * that are currently listening to this table the updated models with thir updated values
         *
         */
        this.actionModelUpdateResponse = (response, modelsUpdated) => {
            console.log("[DataSync] Sending updated models to event");
            let models = {};
            if (Array.isArray(modelsUpdated) || modelsUpdated instanceof Map) {
                modelsUpdated.forEach((model) => {
                    // User is tracking this model?
                    if (response.getUser().getTrackingModelsFrom(model.getTable().getName()).has(model.getId())) {
                        models[model.getId()] = model.asJSON();
                    }
                });
            }
            else {
                models = [modelsUpdated.asJSON()];
            }
            response.sendData("update", { "models": models });
        };
        this.actionModelCreatedResponse = (response, modelsCreated) => {
            console.log("[DataSync] Sending new models to event", modelsCreated);
            let models = {};
            if (Array.isArray(modelsCreated) || modelsCreated instanceof Map) {
                modelsCreated.forEach((model) => {
                    models[model.getId()] = model.asJSON();
                });
            }
            else {
                models = [modelsCreated.asJSON()];
            }
            response.sendData("create", { "models": models });
        };
        /**
         * [DataSync]: Listen
         * -------------------
         *
         * Creates a new TableSync Event-Stream,
         * All tables have their unique connection...
         * >> Will probly have to change hat design since
         * >> browsers limit the aout of keep-alive connections
         * >> made to a server!
         */
        this.listen = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //# - Table : Required
            let table = req.requiredParam('table');
            this.module.getTable(req.getUser(), table)
                //Check for tables avaliable to the user
                .then((table) => {
                if (table != null) {
                    let tableEmitter = table;
                    // - Transform response in a EventStream
                    let response = new AuriaEventResponse_1.AuriaEventResponse(res, req.getUser());
                    // - Attach event listeners to the response
                    this.attachListenersToTable(response, tableEmitter);
                    // - Close when client closes the connection
                    req.getRawRequest().on('close', () => {
                        response.closeConnection();
                        // # - Clear tracking models from user
                        req.getUser().clearTrackingModels(table.getName());
                        // # - Detach table listeners
                        this.detachListenersOfTable(response, tableEmitter);
                        // # - End response stream
                        res.getRawResponse().end();
                    });
                }
                else {
                    console.error("[DataSync] Tables:", table);
                    res.error("500001", "[DataSync] User can't access this table '" + table + "'!");
                }
            })
                // Failed, why?
                .catch((err) => {
                console.error("[DataSync] Failed to open event stream for table ", table, "\nUser Trying to access it: ", req.getUser().getUsername(), "\nError: ", err);
                res.error("500002", "[DataSync] Failed to fetch tables from user!");
            });
        });
        /**
         * [DataSync]: Fetch
         * ------------------
         *
         */
        this.fetch = (req, res) => {
            let table = req.requiredParam('table');
            let dataAccess = this.module.getSystem().getData();
            dataAccess.select(req.getUser(), table)
                .then((query) => __awaiter(this, void 0, void 0, function* () {
                // # - Max number of rows ?
                if (req.hasParam('maxResult')) {
                    let rows = req.getParam('maxResult');
                    query.setMaxNumberOfRows(parseInt(rows));
                }
                // # - Page ?
                if (req.hasParam('page')) {
                    let page = parseInt(req.getParam('page'));
                    query.setPage(page);
                }
                // # - Filters ?
                if (req.hasParam('filters')) {
                    try {
                        let filters = req.getParam('filters');
                        filters.forEach((filter) => {
                            let f = new QueryFilter_1.QueryFilter();
                            f.set(filter.column, filter.op, filter.value);
                            query.addFilters(false, f);
                        });
                    }
                    catch (err) {
                        res.error("", "[DataSync] Failed to parse requested filters!" + err.message);
                    }
                }
                // # - Order
                if (req.hasParam('order')) {
                    let order = req.requiredParam('order');
                    if (Array.isArray(order)) {
                        order.forEach((o) => {
                            query.addOrder({ column: o.column, direction: o.direction });
                        });
                    }
                }
                query.fetch().then((loadedModels) => {
                    let modelsId = [];
                    let modelsJson = {};
                    loadedModels.forEach((model) => {
                        modelsId.push(model.getId());
                        modelsJson[model.getId()] = model.asJSON();
                    });
                    // # - Update user tracking models
                    req.getUser().trackModels(table, modelsId);
                    res.addToResponse({ "models": modelsJson });
                    res.send();
                }).catch((err) => {
                    console.log("[DataSync] Error in SQL Query!" + err);
                    res.error("20005", "[DataSync] Failed to fetch data witht the parameters given to the quest");
                });
            })).catch((err) => {
                console.error("[DataSync] Could not find table! ", err);
                res.error("500003", "[DataSync] Failed to fetch from requested table");
            });
        };
        /**
         * [DataSync] : Update
         * --------------------
         *
         */
        this.save = (req, res) => {
            // # - Table, required
            let tableName = req.requiredParam("table");
            // # Try to load page
            this.module.getTable(req.getUser(), tableName).then((table) => __awaiter(this, void 0, void 0, function* () {
                // Not null?
                if (table != null) {
                    let rows = req.requiredParam("rows");
                    let updatedModels = [];
                    let updatedModelsJson = [];
                    let createdModels = [];
                    let createdModelsJson = [];
                    // # - For each row passed
                    for (var index in rows) {
                        let row = rows[index];
                        let id = row.id;
                        let m = null;
                        // # - ID undefined?
                        if (id != null) {
                            m = yield table.buildModel(id);
                        }
                        else {
                            m = new RowModel_1.RowModel(table);
                        }
                        // # - Row exists?
                        if (m != null && m instanceof RowModel_1.RowModel) {
                            m.setAttribute(row.values);
                            try {
                                if (yield m.save(req.getUser())) {
                                    if (id == null) {
                                        createdModels.push(m);
                                        createdModelsJson.push(m.asJSON());
                                    }
                                    else {
                                        updatedModels.push(m);
                                        updatedModelsJson.push(m.asJSON());
                                    }
                                }
                            }
                            catch (err) {
                                res.error("30008", "Failed to save rows!");
                                return;
                            }
                        }
                    }
                    if (updatedModels.length > 0) {
                        table.emit("update", updatedModels);
                    }
                    if (createdModels.length > 0) {
                        table.emit("create", createdModels);
                    }
                    res.addToResponse({
                        "status": "Saved " + (updatedModels.length + createdModels.length) + " of " + rows.length + " row(s)!",
                        "updatedModels": updatedModelsJson,
                        "createdModels": createdModelsJson
                    });
                    res.send();
                }
                else {
                    res.error("30007", "[DataSync] Table was not accessible to this user or does not exists");
                }
            })).catch((err) => {
                console.error("[DataSync] Failed to retrieve table: ", err);
                res.error("30006", "Can't reach requested table!");
            });
        };
        this.delete = (req, res) => {
            let tableName = req.requiredParam('table');
            let rowId = req.requiredParam('id');
            this.module.getTable(req.getUser(), tableName).then((table) => __awaiter(this, void 0, void 0, function* () {
                if (table != null) {
                    let model = yield table.buildModel(rowId);
                    if (model != null) {
                        let deleted = model.delete(req.getUser());
                        if (deleted) {
                            table.emit("delete", [model]);
                            res.addToResponse({
                                "status": "Row deleted!"
                            });
                            res.send();
                        }
                        else {
                            res.error("500010", "Failed to delete row");
                        }
                    }
                    else {
                        res.error("500011", "Failed to find model, do you have access to it?");
                    }
                }
                else {
                    res.error("500012", "Failed to find table, do you have access to it?");
                }
            }));
        };
        this.listenersOfResponse = new Map();
    }
    getRequiredRequestHandlers() {
        throw new Error("Method not implemented.");
    }
    getExposedActionsDefinition() {
        return {
            "listen": {},
            "fetch": {},
            "save": {},
            "delete": {},
            "lock": {},
            "unlock": {},
        };
    }
    /**
     * Attach Response Listeners to Table
     * ----------------------------------
     *
     * When a EventStream connection is openned some functions
     * work as listener to table events, the attaching and storing
     * of such function is made by this function, don't manually add
     * listeners to the table or be sure to detach them when the connection
     * closes!
     *
     * @param response
     * @param table
     */
    attachListenersToTable(response, table) {
        let fnOfResponse = {
            // # - Model updated
            update: (modelsUpdated) => {
                this.actionModelUpdateResponse(response, modelsUpdated);
            },
            // # - Model created
            create: (modelsCreated) => {
                this.actionModelCreatedResponse(response, modelsCreated);
            },
            // # - Model deleted
            delete: () => {
                response.sendData("delete", { "testing": "true\n\nyea" });
            },
            // # - Model locked
            lock: () => {
                response.sendData("lock", { "testing": "true\n\nyea" });
            },
            // # - Model unlocked
            unlock: () => {
                response.sendData("unlock", { "testing": "true\n\nyea" });
            }
        };
        for (var event in fnOfResponse) {
            if (fnOfResponse.hasOwnProperty(event)) {
                table.addListener(event, fnOfResponse[event]);
            }
        }
        this.listenersOfResponse.set(response, fnOfResponse);
    }
    /**
     * Detach Response Listener to Table Changes
     * -----------------------------------------
     *
     * After openning an event stream the listeners are attached
     * to the table which extends EventEmitter, when this connetion is
     * closed this function clears the listeners
     *
     * @param response
     * @param table
     */
    detachListenersOfTable(response, table) {
        if (this.listenersOfResponse.has(response)) {
            let listeners = this.listenersOfResponse.get(response);
            for (var event in listeners) {
                if (listeners.hasOwnProperty(event)) {
                    table.removeListener(event, listeners[event]);
                }
            }
            this.listenersOfResponse.delete(response);
        }
    }
}
exports.DataSyncListener = DataSyncListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVN5bmNMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvRGF0YVN5bmNMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQXNFO0FBRXRFLHlFQUFzRTtBQUN0RSw0RUFBeUU7QUFJekUseUVBQW9GO0FBY3BGLE1BQWEsZ0JBQWlCLFNBQVEsK0JBQWM7SUFlaEQsWUFBWSxNQUFjO1FBQ3RCLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFlOUI7Ozs7OztXQU1HO1FBQ08sOEJBQXlCLEdBQy9CLENBQUMsUUFBNEIsRUFBRSxhQUErQyxFQUFFLEVBQUU7WUFFOUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBRTFELElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQztZQUVyQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxZQUFZLEdBQUcsRUFBRTtnQkFDOUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQWUsRUFBRSxFQUFFO29CQUN0QywrQkFBK0I7b0JBQy9CLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUN4QyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQzdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNsQjt3QkFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUMxQztnQkFDTCxDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO1lBRUQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUM7UUFFSSwrQkFBMEIsR0FDaEMsQ0FBQyxRQUE0QixFQUFFLGFBQStDLEVBQUUsRUFBRTtZQUU5RSxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBRXJFLElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQztZQUVyQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxZQUFZLEdBQUcsRUFBRTtnQkFDOUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQWUsRUFBRSxFQUFFO29CQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQyxDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO1lBRUQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUM7UUFFTjs7Ozs7Ozs7O1dBU0c7UUFDSSxXQUFNLEdBQW1CLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBRS9DLHNCQUFzQjtZQUN0QixJQUFJLEtBQUssR0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUM7Z0JBQ3RDLHdDQUF3QztpQkFDdkMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ1osSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO29CQUNmLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztvQkFDekIsd0NBQXdDO29CQUN4QyxJQUFJLFFBQVEsR0FBRyxJQUFJLHVDQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDMUQsMkNBQTJDO29CQUMzQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUNwRCw0Q0FBNEM7b0JBQzVDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTt3QkFDakMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUMzQixzQ0FBc0M7d0JBQ3RDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDbkQsNkJBQTZCO3dCQUM3QixJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO3dCQUNwRCwwQkFBMEI7d0JBQzFCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDL0IsQ0FBQyxDQUFDLENBQUM7aUJBQ047cUJBQU07b0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDM0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsMkNBQTJDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO2lCQUNuRjtZQUNMLENBQUMsQ0FBQztnQkFDRixlQUFlO2lCQUNkLEtBQUssQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO2dCQUNoQixPQUFPLENBQUMsS0FBSyxDQUNULG1EQUFtRCxFQUFFLEtBQUssRUFDMUQsOEJBQThCLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUMzRCxXQUFXLEVBQUUsR0FBRyxDQUNuQixDQUFDO2dCQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLDhDQUE4QyxDQUFDLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUM7UUFFWCxDQUFDLENBQUEsQ0FBQztRQTRFRjs7OztXQUlHO1FBQ0ksVUFBSyxHQUFtQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUV4QyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLElBQUksVUFBVSxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXRFLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssQ0FBQztpQkFDbEMsSUFBSSxDQUFDLENBQU8sS0FBSyxFQUFFLEVBQUU7Z0JBRWxCLDJCQUEyQjtnQkFDM0IsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUMzQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNyQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQzVDO2dCQUNELGFBQWE7Z0JBQ2IsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUN0QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2QjtnQkFDRCxnQkFBZ0I7Z0JBQ2hCLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDekIsSUFBSTt3QkFDQSxJQUFJLE9BQU8sR0FBOEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQThCLENBQUM7d0JBQzlGLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUE4QixFQUFFLEVBQUU7NEJBQy9DLElBQUksQ0FBQyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDOzRCQUMxQixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQzlDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixDQUFDLENBQUMsQ0FBQztxQkFDTjtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDVixHQUFHLENBQUMsS0FBSyxDQUNMLEVBQUUsRUFDRiwrQ0FBK0MsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUNoRSxDQUFDO3FCQUNMO2lCQUNKO2dCQUNELFlBQVk7Z0JBQ1osSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN2QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QyxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3JCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTs0QkFDaEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLE1BQU0sRUFBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRyxDQUFDLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQzt3QkFDakUsQ0FBQyxDQUFDLENBQUM7cUJBQ047aUJBQ0o7Z0JBQ0QsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUNoQyxJQUFJLFFBQVEsR0FBVSxFQUFFLENBQUM7b0JBQ3pCLElBQUksVUFBVSxHQUFRLEVBQUUsQ0FBQztvQkFDekIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUMzQixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUM3QixVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMvQyxDQUFDLENBQUMsQ0FBQztvQkFDSCxrQ0FBa0M7b0JBQ2xDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUMzQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7b0JBQzVDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNwRCxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSx5RUFBeUUsQ0FBQyxDQUFDO2dCQUNsRyxDQUFDLENBQUMsQ0FBQztZQUVQLENBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hELEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLGlEQUFpRCxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUM7UUFFRjs7OztXQUlHO1FBRUksU0FBSSxHQUFtQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN2QyxzQkFBc0I7WUFDdEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUzQyxxQkFBcUI7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO2dCQUNoRSxZQUFZO2dCQUNaLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtvQkFFZixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBc0IsQ0FBQztvQkFDMUQsSUFBSSxhQUFhLEdBQWUsRUFBRSxDQUFDO29CQUNuQyxJQUFJLGlCQUFpQixHQUFVLEVBQUUsQ0FBQztvQkFDbEMsSUFBSSxhQUFhLEdBQWUsRUFBRSxDQUFDO29CQUNuQyxJQUFJLGlCQUFpQixHQUFVLEVBQUUsQ0FBQztvQkFFbEMsMEJBQTBCO29CQUMxQixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTt3QkFDcEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0QixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO3dCQUNoQixJQUFJLENBQUMsR0FBaUIsSUFBSSxDQUFDO3dCQUUzQixvQkFBb0I7d0JBQ3BCLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTs0QkFDWixDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUNsQzs2QkFBTTs0QkFDSCxDQUFDLEdBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUMzQjt3QkFFRCxrQkFBa0I7d0JBQ2xCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksbUJBQVEsRUFBRTs0QkFDcEMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQzNCLElBQUk7Z0NBQ0EsSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUU7b0NBQzdCLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTt3Q0FDWixhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dDQUN0QixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7cUNBQ3RDO3lDQUFNO3dDQUNILGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ3RCLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztxQ0FDdEM7aUNBQ0o7NkJBQ0o7NEJBQUMsT0FBTyxHQUFHLEVBQUU7Z0NBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQ0FDM0MsT0FBTzs2QkFDVjt5QkFDSjtxQkFDSjtvQkFDRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUMxQixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztxQkFDdkM7b0JBQ0QsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7cUJBQ3ZDO29CQUNELEdBQUcsQ0FBQyxhQUFhLENBQUM7d0JBQ2QsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVU7d0JBQ3RHLGVBQWUsRUFBRSxpQkFBaUI7d0JBQ2xDLGVBQWUsRUFBRSxpQkFBaUI7cUJBQ3JDLENBQUMsQ0FBQztvQkFDSCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2Q7cUJBQU07b0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUscUVBQXFFLENBQUMsQ0FBQztpQkFDN0Y7WUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVELEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLDhCQUE4QixDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFSyxXQUFNLEdBQW1CLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3pDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0MsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVwQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQU8sS0FBSyxFQUFFLEVBQUU7Z0JBQ2hFLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtvQkFDZixJQUFJLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTt3QkFDZixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLE9BQU8sRUFBRTs0QkFDVCxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQzlCLEdBQUcsQ0FBQyxhQUFhLENBQUM7Z0NBQ2QsUUFBUSxFQUFFLGNBQWM7NkJBQzNCLENBQUMsQ0FBQzs0QkFDSCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ2Q7NkJBQU07NEJBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzt5QkFDL0M7cUJBQ0o7eUJBQU07d0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsaURBQWlELENBQUMsQ0FBQztxQkFDMUU7aUJBQ0o7cUJBQU07b0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsaURBQWlELENBQUMsQ0FBQztpQkFDMUU7WUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBcldFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFoQk0sMEJBQTBCO1FBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBZ0JNLDJCQUEyQjtRQUM5QixPQUFPO1lBQ0gsUUFBUSxFQUFFLEVBQUU7WUFDWixPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsRUFBRTtZQUNWLFFBQVEsRUFBRSxFQUFFO1NBQ2YsQ0FBQztJQUNOLENBQUM7SUF1R0Q7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0ssc0JBQXNCLENBQUMsUUFBNEIsRUFBRSxLQUFZO1FBRXJFLElBQUksWUFBWSxHQUFRO1lBQ3BCLG9CQUFvQjtZQUNwQixNQUFNLEVBQUUsQ0FBQyxhQUFrQixFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUVELG9CQUFvQjtZQUNwQixNQUFNLEVBQUUsQ0FBQyxhQUFrQixFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDN0QsQ0FBQztZQUVELG9CQUFvQjtZQUNwQixNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUNULFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUVELG1CQUFtQjtZQUNuQixJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUNQLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUVELHFCQUFxQjtZQUNyQixNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUNULFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQztTQUNKLENBQUM7UUFFRixLQUFLLElBQUksS0FBSyxJQUFJLFlBQVksRUFBRTtZQUM1QixJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2pEO1NBQ0o7UUFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNLLHNCQUFzQixDQUFDLFFBQTRCLEVBQUUsS0FBWTtRQUNyRSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDeEMsSUFBSSxTQUFTLEdBQVEsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1RCxLQUFLLElBQUksS0FBSyxJQUFJLFNBQVMsRUFBRTtnQkFDekIsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNqQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDakQ7YUFDSjtZQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDN0M7SUFDTCxDQUFDO0NBMktKO0FBdlhELDRDQXVYQyJ9