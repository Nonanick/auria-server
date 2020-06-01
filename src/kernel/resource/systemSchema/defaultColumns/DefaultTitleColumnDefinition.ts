import { ResourceColumnDefinition } from "../../ResourceColumn.js";


export const DefaultTitleColumnDefinition: ResourceColumnDefinition = {
    name: "Title",
    columnName: "title",
    sqlType: "VARCHAR",
    length: 255,
    nullable: true,
}