import { ModuleListener, ListenerAction } from "../../ModuleListener";
import { Module } from "../../Module";
import { AuriaEventResponse } from "../../../http/AuriaEventResponse";
import { RowModel } from "../../../database/structure/rowModel/RowModel";
import { DataAccessManager } from "../../../security/data/DataAccessManager";
import { Model } from "aurialib2";
import { Table } from "../../../database/structure/table/Table";
import { SQLOperators, QueryFilter } from "../../../database/dataQuery/QueryFilter";
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";

type RowSaveInfoData = {
    id: any;
    values: any;
};

type TableDataFilterRequest = {
    column: string;
    op: SQLOperators;
    value: string;
};

export class DataSyncListener extends ModuleListener {

    public getRequiredRequestHandlers(): AuriaMiddleware[] {
        throw new Error("Method not implemented.");
    }

    /**
     * Listeners of EventResponse
     * --------------------------
     * 
     * Hold the functions currently being used by EventStream responses
     * so that they can be detached once the connection closes
     */
    protected listenersOfResponse: Map<AuriaEventResponse, any>;

    constructor(module: Module) {
        super(module, "DataSync");
        this.listenersOfResponse = new Map();
    }

    public getExposedActionsDefinition() {
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
     * [Action]: Model Updated
     * ------------------------
     * Event triggered function that will send to all EventStream responses
     * that are currently listening to this table the updated models with thir updated values
     * 
     */
    protected actionModelUpdateResponse =
        (response: AuriaEventResponse, modelsUpdated: Map<string, RowModel> | RowModel) => {

            console.log("[DataSync] Sending updated models to event");

            let models: any = {};

            if (Array.isArray(modelsUpdated) || modelsUpdated instanceof Map) {
                modelsUpdated.forEach((model: RowModel) => {
                    // User is tracking this model?
                    if (response.getUser().getTrackingModelsFrom(
                        model.getTable().getName()
                    ).has(model.getId())
                    ) {
                        models[model.getId()] = model.asJSON();
                    }
                });
            } else {
                models = [modelsUpdated.asJSON()];
            }

            response.sendData("update", { "models": models });
        };

    protected actionModelCreatedResponse =
        (response: AuriaEventResponse, modelsCreated: Map<string, RowModel> | RowModel) => {

            console.log("[DataSync] Sending new models to event", modelsCreated);

            let models: any = {};

            if (Array.isArray(modelsCreated) || modelsCreated instanceof Map) {
                modelsCreated.forEach((model: RowModel) => {
                    models[model.getId()] = model.asJSON();
                });
            } else {
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
    public listen: ListenerAction = async (req, res) => {

        //# - Table : Required
        let table: string = req.requiredParam('table');

        this.module.getTable(req.getUser(), table)
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
            });

    };


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
    private attachListenersToTable(response: AuriaEventResponse, table: Table) {

        let fnOfResponse: any = {
            // # - Model updated
            update: (modelsUpdated: any) => {
                this.actionModelUpdateResponse(response, modelsUpdated);
            },

            // # - Model created
            create: (modelsCreated: any) => {
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
    private detachListenersOfTable(response: AuriaEventResponse, table: Table) {
        if (this.listenersOfResponse.has(response)) {
            let listeners: any = this.listenersOfResponse.get(response);
            for (var event in listeners) {
                if (listeners.hasOwnProperty(event)) {
                    table.removeListener(event, listeners[event]);
                }
            }
            this.listenersOfResponse.delete(response);
        }
    }
    /**
     * [DataSync]: Fetch
     * ------------------
     * 
     */
    public fetch: ListenerAction = (req, res) => {

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
    };

    /**
     * [DataSync] : Update
     * --------------------
     * 
     */

    public save: ListenerAction = (req, res) => {
        // # - Table, required
        let tableName = req.requiredParam("table");

        // # Try to load page
        this.module.getTable(req.getUser(), tableName).then(async (table) => {
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
        });
    };

    public delete: ListenerAction = (req, res) => {
        let tableName = req.requiredParam('table');
        let rowId = req.requiredParam('id');

        this.module.getTable(req.getUser(), tableName).then(async (table) => {
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
        });
    };
}