import { ModuleListener, ListenerAction } from "../../ModuleListener";
import { Module } from "../../Module";
import { AuriaEventResponse } from "../../../http/AuriaEventResponse";
import { RowModel } from "../../../database/structure/rowModel/RowModel";
import { Table } from "../../../database/structure/table/Table";
import { SQLOperators } from "../../../database/dataQuery/QueryFilter";
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";
export declare type RowSaveInfoData = {
    id: any;
    values: any;
};
export declare type TableDataFilterRequest = {
    column: string;
    op: SQLOperators;
    value: string;
};
export declare class DataSyncListener extends ModuleListener {
    getRequiredRequestHandlers(): AuriaMiddleware[];
    /**
     * Listeners of EventResponse
     * --------------------------
     *
     * Hold the functions currently being used by EventStream responses
     * so that they can be detached once the connection closes
     */
    protected listenersOfResponse: Map<AuriaEventResponse, any>;
    constructor(module: Module);
    getExposedActionsDefinition(): {
        "listen": {};
        "fetch": {};
        "save": {};
        "delete": {};
        "lock": {};
        "unlock": {};
    };
    /**
     * [Action]: Model Updated
     * ------------------------
     * Event triggered function that will send to all EventStream responses
     * that are currently listening to this table the updated models with thir updated values
     *
     */
    protected actionModelUpdateResponse: (response: AuriaEventResponse, modelsUpdated: RowModel | Map<string, RowModel>) => void;
    protected actionModelCreatedResponse: (response: AuriaEventResponse, modelsCreated: RowModel | Map<string, RowModel>) => void;
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
    listen: ListenerAction;
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
    protected attachListenersToTable(response: AuriaEventResponse, table: Table): void;
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
    protected detachListenersOfTable(response: AuriaEventResponse, table: Table): void;
    /**
     * [DataSync]: Fetch
     * ------------------
     *
     */
    fetch: ListenerAction;
    /**
     * [DataSync] : Update
     * --------------------
     *
     */
    save: ListenerAction;
    delete: ListenerAction;
}
