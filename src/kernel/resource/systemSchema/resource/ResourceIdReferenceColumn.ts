import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ResourceResourceDefinition } from "./ResourceResourceDefinition.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let resourceId : Partial<ResourceColumnDefinition> = {
    name: "Resource ID",
    columnName: "resource_id",
    nullable : false,
    primary : false,
    autoIncrement : false,
    references: {
        columnName : DefaultIdColumnDefinition.columnName,
        tableName : ResourceResourceDefinition.tableName,
        onDelete : "RESTRICT",
        onUpdate : "CASCADE"
    }
};

export const ResourceIdReferenceColumnDefinition : ResourceColumnDefinition = Object.assign({} , DefaultIdColumnDefinition, resourceId);