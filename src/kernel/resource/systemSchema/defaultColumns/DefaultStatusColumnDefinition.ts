import { ResourceColumnDefinition } from "../../ResourceColumn.js";


export const DefaultStatusColumnDefinition : ResourceColumnDefinition = {
    name : "Status",
    columnName : "entry_status",
    sqlType : "VARCHAR",
    length : 50,
    default : "active",
    nullable : false,
}