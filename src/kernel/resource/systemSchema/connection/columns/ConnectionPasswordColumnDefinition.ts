import { ResourceColumnDefinition } from "../../../ResourceColumn.js";

export const ConnectionPasswordColumnDefinition : ResourceColumnDefinition = {
    name : "Password",
    columnName : "password",
    sqlType : "VARCHAR",
    length : 255,
    nullable : false
}