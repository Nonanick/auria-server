import { ResourceColumnDefinition } from "../../ResourceColumn.js";


export const DefaultNameColumnDefinition : ResourceColumnDefinition = {
    name : "Name",
    columnName : "name",
    sqlType : "VARCHAR",
    length : 255,
    index : true,
}