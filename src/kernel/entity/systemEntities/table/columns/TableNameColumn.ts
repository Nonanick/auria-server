import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class TableNameColumn extends EntityColumn {

    constructor() {
        super("Table Name");
        this.columnName = "table_name";
        this.sqlType = "VARCHAR";
        this.length = 255;
    }
    
    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).notNullable().index();
    }
}