import { Table } from "../../database/structure/table/Table";
import { SystemUser } from "../SystemUser";
import { TableDataQuery } from "../../database/dataQuery/TableDataQuery";
import { TableAction } from "../../database/structure/table/TableAction";

export class TableAccess {

    protected table : Table;
    
    protected user : SystemUser;

    protected tableActions : Map<string, TableAction>;

    constructor(user : SystemUser, table : Table, actions : TableAction[]) {
        this.table = table;
        this.user = user;
    }

    public newQuery() : TableDataQuery {
        let q = this.table.newQuery();


        return q;
    }
}