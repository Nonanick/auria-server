import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class ColumnNameColumn extends EntityColumn {


    constructor() {
        super("SQL Column Name");
        this.columnName = "column_name";
        this.length = 255;
        this.sqlType = "VARCHAR";
        this.index = true;
    }
    
    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).index().notNullable();
    }

}