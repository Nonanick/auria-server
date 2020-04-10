import { EntityColumn } from "../EntityColumn";
import Knex from "knex";

export class DefaultStatusColumn extends EntityColumn {

    constructor() {
        super("Status");
        this.columnName = "entry_status";
        this.sqlType = "VARCHAR";
        this.length = 50;
        this.index = true;
        this.defaultValue = "active";

    }

    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.string(this.columnName, this.length).index().defaultTo(this.defaultValue);
    }

}