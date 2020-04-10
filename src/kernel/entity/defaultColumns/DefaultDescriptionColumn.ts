import { EntityColumn } from "../EntityColumn";

export class DefaultDescriptionColumn extends EntityColumn {

    constructor() {
        super("Description");
        this.columnName = "description";
        this.sqlType = "TEXT";
        this.defaultValue = "";
    }
    
    public buildSchema(builder: import("knex").CreateTableBuilder) {
       builder.text(this.columnName).defaultTo(this.defaultValue);
    }

}