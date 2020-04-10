import { EntityColumn } from "../EntityColumn";
import Knex from "knex";

export class DefaultTitleColumn extends EntityColumn {

    constructor() {
        super("Title");
        this.sqlType = "TEXT";
        this.columnName = "title";

    }

    public buildSchema(builder: Knex.CreateTableBuilder) {
        builder.text(this.columnName);
    }

}