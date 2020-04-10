import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class HostColumn extends EntityColumn {

    constructor(){
        super("Host");
        this.columnName = "host";
        this.sqlType = "VARCHAR";
        this.length = 255;
    }
    
    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName).notNullable();
    }

}