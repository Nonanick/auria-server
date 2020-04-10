import { EntityColumn } from "../EntityColumn";
import Knex from "knex";

export class DefaultNameColumn extends EntityColumn {

    constructor() {
        super("Name");
        this.columnName = "name";
        this.sqlType = "VARCHAR";
        this.index = true;
    }

    public buildSchema(builder: Knex.CreateTableBuilder) {

        let column = builder.string(this.columnName).notNullable();

        if (this.unique) column.unique();
        if (this.index) column.index();

    }
}