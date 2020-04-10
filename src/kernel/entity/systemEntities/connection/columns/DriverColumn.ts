import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class DriverColumn extends EntityColumn {

    constructor() {
        super("Driver");
        this.columnName = "driver";
        this.sqlType = "VARCHAR";
        this.length = 255;

    }
    
    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName).notNullable();
    }

}