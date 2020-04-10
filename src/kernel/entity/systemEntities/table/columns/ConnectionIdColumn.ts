import { EntityColumn } from "../../../EntityColumn";
import Knex from "knex";
import { ConnectionSystemEntityName } from "../../connection/Connection";

export class ConnectionIdColumn extends EntityColumn {
    
    constructor() {
        super("Connection ID");
        
        this.columnName = "connection_id";
        this.sqlType = "BIGINT";
        this.unsigned = true;
        this.index = true;
        this.foreignKey = true;
    }

    public buildSchema(builder: Knex.CreateTableBuilder) {

        builder.bigInteger(this.columnName).index().notNullable()
        .unsigned().references("_id").inTable(ConnectionSystemEntityName)
        .onUpdate("CASCADE").onDelete("RESTRICT");
    }

}