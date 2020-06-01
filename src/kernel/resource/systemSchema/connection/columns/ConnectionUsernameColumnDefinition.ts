import { ResourceColumnDefinition } from "../../../ResourceColumn.js";

export const ConnectionUsernameColumnDefinition : ResourceColumnDefinition = {
    name : "Username",
    columnName : "username",
    sqlType : "VARCHAR",
    length : 255,
    nullable : false,
}