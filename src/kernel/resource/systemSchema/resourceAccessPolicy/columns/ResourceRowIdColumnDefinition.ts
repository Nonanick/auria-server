import { ResourceColumnDefinition } from "../../../ResourceColumn.js";

export const ResourceRowIdColumnDefinition: ResourceColumnDefinition = {
    name: "Resource Row ID",
    columnName: "resource_row_id",
    sqlType: "VARCHAR",
    length: 255,
    index: true,
};