import { Table } from "../../database/structure/table/Table";
import { SystemUser } from "../SystemUser";
import { TableDataQuery } from "../../database/dataQuery/TableDataQuery";
import { TableAction } from "../../database/structure/table/TableAction";
export declare class TableAccess {
    protected table: Table;
    protected user: SystemUser;
    protected tableActions: Map<string, TableAction>;
    constructor(user: SystemUser, table: Table, actions: TableAction[]);
    newQuery(): TableDataQuery;
}
