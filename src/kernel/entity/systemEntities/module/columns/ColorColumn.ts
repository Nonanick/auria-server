import { EntityColumn } from "../../../EntityColumn";

export class ColorColumn extends EntityColumn {
    

    constructor() {
        super("Module Accent Color");
        this.columnName = "color";
        this.sqlType = "VARCHAR";
        this.length = 255;
    }

    public buildSchema(builder: import("knex").CreateTableBuilder) {
        builder.string(this.columnName, this.length).notNullable();
    }
}