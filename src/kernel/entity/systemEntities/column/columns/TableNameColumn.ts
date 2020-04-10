import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";
import { TableSystemEntityName } from "../../table/Table";

export class TableNameColumn extends EntityColumn {

    constructor() {
        super("Table Name");
        this.columnName = "table_name";
        this.sqlType = "VARCHAR";
        this.length = 255;
        this.index = true;
    }

    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).index().notNullable()
            .references("name").inTable(TableSystemEntityName)
            .onUpdate("CASCADE").onDelete("RESTRICT");
    }

}