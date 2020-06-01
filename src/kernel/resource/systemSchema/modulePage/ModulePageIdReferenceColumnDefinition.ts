import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ModulePageResourceDefinition } from "./ModulePageResourceDefinition.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let pageId: Partial<ResourceColumnDefinition> = {
    name: "Page ID",
    columnName: "page_id",
    nullable: false,
    primary : false,
    autoIncrement : false,
    references: {
        columnName: DefaultIdColumnDefinition.columnName,
        tableName: ModulePageResourceDefinition.tableName,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    }
};

export const ModulePageIdReferenceColumnDefinition: ResourceColumnDefinition = Object.assign({}, DefaultIdColumnDefinition, pageId);