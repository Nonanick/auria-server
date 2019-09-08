import { TableManager } from "../../database/TableManager";
import { System } from "../../System";
import { SystemUser } from "../SystemUser";
import { Table } from "../../database/structure/table/Table";
import { TableDataQuery } from "../../database/dataQuery/TableDataQuery";
import { UpdateAction } from "../../database/structure/table/actions/UpdateAction";
import { CreateAction } from "../../database/structure/table/actions/CreateAction";
import { DeleteAction } from "../../database/structure/table/actions/DeleteAction";
import { LockAction } from "../../database/structure/table/actions/LockAction";
import { UnlockAction } from "../../database/structure/table/actions/UnlockAction";
import { RowModel } from "../../database/structure/rowModel/RowModel";
export declare class DataAccessManager {
    /**
     * Table Manager
     * -------------
     *
     * Holds and loads all the tables in the system
     */
    tableManager: TableManager;
    /**
     * Permission Table
     * -----------------
     * Mehh
     */
    private permissionTable;
    /**
     * System
     * -------
     *
     * System this data access maager responds to
     */
    protected system: System;
    constructor(system: System, dataPermissionTable: Table);
    getTable(user: SystemUser, table: string): Promise<Table>;
    select(user: SystemUser, tableName: string): Promise<TableDataQuery>;
    update(user: SystemUser, table: Table, rowModels: RowModel[]): Promise<UpdateAction>;
    insert(user: SystemUser, table: Table, rowModels: RowModel[]): Promise<CreateAction>;
    delete(user: SystemUser, table: Table, rowModels: RowModel[]): Promise<DeleteAction>;
    lock(user: SystemUser, table: Table): Promise<LockAction>;
    unlock(user: SystemUser, table: Table): Promise<UnlockAction>;
    protected userHasAccessToTable(user: SystemUser, table: string): boolean;
    listAllTables(by: "name" | "table"): Promise<string[]>;
}
