import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class UsernameColumn extends EntityColumn {

    constructor() {
        super("Username");
        this.columnName = "username";
        this.sqlType = "VARCHAR";
        this.length = 255;

    }
    
    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).notNullable();
    }

}