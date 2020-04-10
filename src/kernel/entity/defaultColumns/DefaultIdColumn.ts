import { EntityColumn } from "../EntityColumn";
import Knex from "knex";

export class DefaultIdColumn extends EntityColumn {

    constructor() {
        super("Numeric Identificator");
        this.columnName = "_id";
        this.sqlType = "BIGINT";
        this.primaryKey = true;
        this.unsigned = true;
    }

    public buildSchema(builder: Knex.CreateTableBuilder) {
        return builder.bigIncrements("_id").unsigned().primary();
    }

}