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
        this.listen = (req) => __awaiter(this, void 0, void 0, function* () {
            //# - Table : Required
            //let table: string = req.requiredParam('table');
            /*this.module.getTable(req.getUser(), table)
                //Check for tables avaliable to the user
                .then((table) => {
                    if (table != null) {
                        let tableEmitter = table;
                        // - Transform response in a EventStream
                        let response = new AuriaEventResponse(res, req.getUser());
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
                    } else {
                        console.error("[DataSync] Tables:", table);
                        res.error("500001", "[DataSync] User can't access this table '" + table + "'!");
                    }
                })
                // Failed, why?
                .catch((err: any) => {
                    console.error(
                        "[DataSync] Failed to open event stream for table ", table,
                        "\nUser Trying to access it: ", req.getUser().getUsername(),
                        "\nError: ", err
                    );
                    res.error("500002", "[DataSync] Failed to fetch tables from user!");
                });*/
        });
        /**
         * [DataSync]: Fetch
         * ------------------
         *
         */
        this.fetch = (req) => {
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
        this.save = (req) => {
            // # - Table, required
            // let tableName = req.requiredParam("table");
            // # Try to load page
            /* this.module.getTable(req.getUser(), tableName).then(async (table) => {
                 // Not null?
                 if (table != null) {
     
                     let rows = req.requiredParam("rows") as RowSaveInfoData[];
                     let updatedModels: RowModel[] = [];
                     let updatedModelsJson: any[] = [];
                     let createdModels: RowModel[] = [];
                     let createdModelsJson: any[] = [];
     
                     // # - For each row passed
                     for (var index in rows) {
                         let row = rows[index];
                         let id = row.id;
                         let m: Model | null = null;
     
                         // # - ID undefined?
                         if (id != null) {
                             m = await table.buildModel(id);
                         } else {
                             m = new RowModel(table);
                         }
     
                         // # - Row exists?
                         if (m != null && m instanceof RowModel) {
                             m.setAttribute(row.values);
                             try {
                                 if (await m.save(req.getUser())) {
                                     if (id == null) {
                                         createdModels.push(m);
                                         createdModelsJson.push(m.asJSON());
                                     } else {
                                         updatedModels.push(m);
                                         updatedModelsJson.push(m.asJSON());
                                     }
                                 }
                             } catch (err) {
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
                 } else {
                     res.error("30007", "[DataSync] Table was not accessible to this user or does not exists");
                 }
             }).catch((err) => {
                 console.error("[DataSync] Failed to retrieve table: ", err);
                 res.error("30006", "Can't reach requested table!");
             });*/
        };
        this.delete = (req) => {
            //let tableName = req.requiredParam('table');
            //let rowId = req.requiredParam('id');
            /* this.module.getTable(req.getUser(), tableName).then(async (table) => {
                 if (table != null) {
                     let model = await table.buildModel(rowId);
                     if (model != null) {
                         let deleted = model.delete(req.getUser());
                         if (deleted) {
                             table.emit("delete", [model]);
                             res.addToResponse({
                                 "status": "Row deleted!"
                             });
                             res.send();
                         } else {
                             res.error("500010", "Failed to delete row");
                         }
                     } else {
                         res.error("500011", "Failed to find model, do you have access to it?");
                     }
                 } else {
                     res.error("500012", "Failed to find table, do you have access to it?");
                 }
             });*/
        };
        this.listenersOfResponse = new Map();
    }
    getExposedActionsMetadata() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVN5bmNMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvRGF0YVN5bmNMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQXNEO0FBbUJ0RCxNQUFhLGdCQUFpQixTQUFRLCtCQUFjO0lBV2hELFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBZTlCOzs7Ozs7V0FNRztRQUNPLDhCQUF5QixHQUMvQixDQUFDLFFBQTRCLEVBQUUsYUFBK0MsRUFBRSxFQUFFO1lBRTlFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUUxRCxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUM7WUFFckIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsWUFBWSxHQUFHLEVBQUU7Z0JBQzlELGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFlLEVBQUUsRUFBRTtvQkFDdEMsK0JBQStCO29CQUMvQixJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FDeEMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUM3QixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDbEI7d0JBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDMUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7YUFDTjtpQkFBTTtnQkFDSCxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUNyQztZQUVELFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDO1FBRUksK0JBQTBCLEdBQ2hDLENBQUMsUUFBNEIsRUFBRSxhQUErQyxFQUFFLEVBQUU7WUFFOUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUVyRSxJQUFJLE1BQU0sR0FBUSxFQUFFLENBQUM7WUFFckIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsWUFBWSxHQUFHLEVBQUU7Z0JBQzlELGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFlLEVBQUUsRUFBRTtvQkFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLENBQUM7YUFDTjtpQkFBTTtnQkFDSCxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUNyQztZQUVELFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDO1FBRU47Ozs7Ozs7OztXQVNHO1FBQ0ksV0FBTSxHQUFtQixDQUFPLEdBQUcsRUFBRSxFQUFFO1lBRTFDLHNCQUFzQjtZQUN0QixpREFBaUQ7WUFFakQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQWdDUztRQUViLENBQUMsQ0FBQSxDQUFDO1FBNEVGOzs7O1dBSUc7UUFDSSxVQUFLLEdBQW1CLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFFbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3ZDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkE4RE07UUFDVixDQUFDLENBQUM7UUFFRjs7OztXQUlHO1FBRUksU0FBSSxHQUFtQixDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2xDLHNCQUFzQjtZQUN2Qiw4Q0FBOEM7WUFFN0MscUJBQXFCO1lBQ3RCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBNERNO1FBQ1QsQ0FBQyxDQUFDO1FBRUssV0FBTSxHQUFtQixDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3BDLDZDQUE2QztZQUM3QyxzQ0FBc0M7WUFFdkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQW9CTTtRQUNULENBQUMsQ0FBQztRQXhXRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRU0seUJBQXlCO1FBQzVCLE9BQU87WUFDSCxRQUFRLEVBQUUsRUFBRTtZQUNaLE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxFQUFFLEVBQUU7WUFDVixRQUFRLEVBQUUsRUFBRTtZQUNaLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUU7U0FDZixDQUFDO0lBQ04sQ0FBQztJQXVHRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDTyxzQkFBc0IsQ0FBQyxRQUE0QixFQUFFLEtBQVk7UUFFdkUsSUFBSSxZQUFZLEdBQVE7WUFDcEIsb0JBQW9CO1lBQ3BCLE1BQU0sRUFBRSxDQUFDLGFBQWtCLEVBQUUsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBRUQsb0JBQW9CO1lBQ3BCLE1BQU0sRUFBRSxDQUFDLGFBQWtCLEVBQUUsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBRUQsb0JBQW9CO1lBQ3BCLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQ1QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUM5RCxDQUFDO1lBRUQsbUJBQW1CO1lBQ25CLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ1AsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBRUQscUJBQXFCO1lBQ3JCLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQ1QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUM5RCxDQUFDO1NBQ0osQ0FBQztRQUVGLEtBQUssSUFBSSxLQUFLLElBQUksWUFBWSxFQUFFO1lBQzVCLElBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDcEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakQ7U0FDSjtRQUVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ08sc0JBQXNCLENBQUMsUUFBNEIsRUFBRSxLQUFZO1FBQ3ZFLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN4QyxJQUFJLFNBQVMsR0FBUSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELEtBQUssSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO2dCQUN6QixJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2pDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNqRDthQUNKO1lBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7Q0E4S0o7QUF0WEQsNENBc1hDIn0=