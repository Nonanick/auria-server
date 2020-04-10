import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class SQLTypeColumn extends EntityColumn {
   

    constructor() {
        super("SQL Type");
        this.columnName = "sql_type";
        this.sqlType = "VARCHAR";
        this.length = 255;
    }

    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).notNullable();
    }
}