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
            throw new Error("Not implemented yet");
            /*
            let table = req.requiredParam('table');
            let dataAccess: DataAccessManager = this.module.getSystem().getData();
    
            dataAccess.select(req.getUser(), table)
                .then(async (query) => {
    
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
                            let filters: TableDataFilterRequest[] = (req.getParam('filters') as TableDataFilterRequest[]);
                            filters.forEach((filter: TableDataFilterRequest) => {
                                let f = new QueryFilter();
                                f.set(filter.column, filter.op, filter.value);
                                query.addFilters(false, f);
                            });
                        } catch (err) {
                            res.error(
                                "",
                                "[DataSync] Failed to parse requested filters!" + err.message
                            );
                        }
                    }
                    // # - Order
                    if (req.hasParam('order')) {
                        let order = req.requiredParam('order');
                        if(Array.isArray(order)) {
                            order.forEach((o) => {
                                query.addOrder({column : o.column, direction : o.direction});
                            });
                        }
                    }
                    query.fetch().then((loadedModels) => {
                        let modelsId: any[] = [];
                        let modelsJson: any = {};
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
    
                }).catch((err: any) => {
                    console.error("[DataSync] Could not find table! ", err);
                    res.error("500003", "[DataSync] Failed to fetch from requested table");
                });
                */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVN5bmNMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvRGF0YVN5bmNMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQXNFO0FBRXRFLHlFQUFzRTtBQUN0RSw0RUFBeUU7QUFpQnpFLE1BQWEsZ0JBQWlCLFNBQVEsK0JBQWM7SUFlaEQsWUFBWSxNQUFjO1FBQ3RCLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFlOUI7Ozs7OztXQU1HO1FBQ08sOEJBQXlCLEdBQy9CLENBQUMsUUFBNEIsRUFBRSxhQUErQyxFQUFFLEVBQUU7WUFFOUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBRTFELElBQUksTUFBTSxHQUFRLEVBQUUsQ0FBQztZQUVyQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxZQUFZLEdBQUcsRUFBRTtnQkFDOUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQWUsRUFBRSxFQUFFO29CQUN0QywrQkFBK0I7b0JBQy9CLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUN4QyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQzdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUNsQjt3QkFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUMxQztnQkFDTCxDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO1lBRUQsUUFBUSxDQUFDLFFBQVEsQ0FB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