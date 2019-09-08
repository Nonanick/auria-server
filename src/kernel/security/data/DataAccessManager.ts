import { TableManager } from "../../database/TableManager";
import { System } from "../../System";
import { SystemUser, SystemUserPrivilege } from "../SystemUser";
import { Table } from "../../database/structure/table/Table";
import { QueryFilter } from "../../database/dataQuery/QueryFilter";
import { TableDataQuery } from "../../database/dataQuery/TableDataQuery";
import { UpdateAction } from "../../database/structure/table/actions/UpdateAction";
import { CreateAction } from "../../database/structure/table/actions/CreateAction";
import { DeleteAction } from "../../database/structure/table/actions/DeleteAction";
import { LockAction } from "../../database/structure/table/actions/LockAction";
import { UnlockAction } from "../../database/structure/table/actions/UnlockAction";
import { RowModel } from "../../database/structure/rowModel/RowModel";

export class DataAccessManager {

    /**
     * Table Manager
     * -------------
     * 
     * Holds and loads all the tables in the system
     */
    public tableManager: TableManager;

    /**
     * Permission Table
     * -----------------
     * Mehh
     */
    private permissionTable: Table;

    /**
     * System
     * -------
     * 
     * System this data access maager responds to
     */
    protected system: System;

    constructor(system: System, dataPermissionTable: Table) {

        this.tableManager = new TableManager(system);

        this.system = system;

        this.permissionTable = dataPermissionTable
    }

    public async getTable(user: SystemUser, table: string) {

        if (this.userHasAccessToTable(user, table)) {
            return this.tableManager.getTable(table);
        } else {
            throw new Error("[Unauthorized] User can't reach requested table!");
        }
    }

    public async select(user: SystemUser, tableName: string): Promise<TableDataQuery> {
        let selPromise = new Promise<TableDataQuery>(
            async (resolve, reject) => {
                if (this.userHasAccessToTable(user, tableName)) {
                    let table = await this.tableManager.getTable(tableName);
                    let query = table.newQuery();
                    query.addFilters(true, new QueryFilter())

                    resolve(query);

                } else {
                    reject("[DataAccessManager] User does not have access to table, can't read!");
                }
            }
        );

        return selPromise;
    }

    public async update(user: SystemUser, table: Table, rowModels: RowModel[]): Promise<UpdateAction> {
        return new UpdateAction(table);
    }

    public async insert(user: SystemUser, table: Table, rowModels: RowModel[]): Promise<CreateAction> {
        return new CreateAction(table);
    }

    public async delete(user: SystemUser, table: Table, rowModels: RowModel[]): Promise<DeleteAction> {
        return new DeleteAction(table);
    }

    public async lock(user: SystemUser, table: Table): Promise<LockAction> {
        return new LockAction(table);
    }

    public async unlock(user: SystemUser, table: Table): Promise<UnlockAction> {
        return new UnlockAction(table);
    }

    protected userHasAccessToTable(user: SystemUser, table: string): boolean {
        if (user.getAccessLevel() == SystemUserPrivilege.MASTER) {
            return true;
        } else {
            this.permissionTable.newQuery().addFilters(false,
                new QueryFilter().set("user_id", "=", user.getUsername())
            );
            return false;
        }
    }

    public async listAllTables(by: "name" | "table"): Promise<string[]> {
        return this.tableManager.getTables()
            .then(
                tables => {
                    let ret: string[] = [];

                    tables.forEach((t) => {
                        ret.push(by == "name" ? t.getName() : t.table);
                    });

                    return ret;
                }
            );
    }
}