import { EntityColumn } from "../../../EntityColumn";

export class IconColumn extends EntityColumn {

    constructor() {
        super("Module Icon");
        this.sqlType = "VARCHAR";
        this.length = 255;
        this.columnName = "icon";

    }
    public buildSchema(builder: import("knex").CreateTableBuilder) {
        builder.string(this.columnName, this.length).notNullable();
    }

}