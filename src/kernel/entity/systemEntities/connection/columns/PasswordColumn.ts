import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";

export class PasswordColumn extends EntityColumn {
   

    constructor() {
        super("Database Password");
        this.sqlType = "TEXT";
        this.columnName = "password";
    }

    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.text(this.columnName).notNullable();
    }


}