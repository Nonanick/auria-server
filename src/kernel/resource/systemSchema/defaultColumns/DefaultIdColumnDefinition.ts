import { ResourceColumnDefinition } from "../../ResourceColumn.js";

export const DefaultIdColumnDefinition : ResourceColumnDefinition = {
    name : "ID",
    columnName : "_id",
    sqlType : "BIGINT",
    primary : true,
    autoIncrement : true,
    unsigned : true,
    nullable : false,
}