import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class DatabaseColumn extends EntityColumn {

    constructor() {
        super("Database");
        this.columnName = "database";
        this.sqlType = "VARCHAR";
        this.length = 255;
        
    }
    
    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).notNullable();
    }

}