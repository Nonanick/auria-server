import { SystemEntity } from "../../SystemEntity";
import Knex from "knex";
import { ConnectionIdColumn } from "./columns/ConnectionIdColumn";
import { TableNameColumn } from "./columns/TableNameColumn";
import { DefaultIdColumn, DefaultNameColumn, DefaultTitleColumn, DefaultStatusColumn } from "../../DefaultColumns";

export class Table extends SystemEntity {

    constructor() {
        super(TableSystemEntityName);

        this.addColumns(
            // # Default Id, Name and Title columns
            new DefaultIdColumn(),
            new DefaultNameColumn(),
            new DefaultTitleColumn(),

            // # Table specific columns
            new ConnectionIdColumn(),
            new TableNameColumn(),

            // # Default Status column
            new DefaultStatusColumn(),
        )

    }
    protected buildTable(conn: Knex, tableBuilder: Knex.CreateTableBuilder) {
        super.buildTable(conn, tableBuilder);

        tableBuilder.unique(["connection_id", "table_name"])
        return [conn, tableBuilder];
    }
}

export const TableSystemEntityName = "Auria_Table";