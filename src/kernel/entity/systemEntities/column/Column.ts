import { SystemEntity } from "../../SystemEntity";
import { DefaultIdColumn, DefaultNameColumn, DefaultTitleColumn, DefaultStatusColumn } from "../../DefaultColumns";
import { TableNameColumn } from "./columns/TableNameColumn";
import { ColumnNameColumn } from "./columns/ColumnNameColumn";
import { SQLTypeColumn } from "./columns/SQLTypeColumn";
import Knex from "knex";

export class Column extends SystemEntity {

    constructor() {
        super(ColumnSystemEntityName);

        this.addColumns(
            // # Default Id, Name and Title columns
            new DefaultIdColumn(),
            new DefaultNameColumn(),
            new DefaultTitleColumn(),

            // 'Column' specific columns
            new TableNameColumn(),
            new ColumnNameColumn(),
            new SQLTypeColumn(),
            
            // # Default Status column
            new DefaultStatusColumn()
        )
    }

    public buildTable(conn : Knex, builder : Knex.CreateTableBuilder) {
        super.buildTable(conn, builder);
        builder.unique(["table_name","name"]);
        return [conn, builder];
    }
}
export const ColumnSystemEntityName = "Auria_Column";