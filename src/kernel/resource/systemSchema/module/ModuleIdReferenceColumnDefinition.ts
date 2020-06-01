import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ModuleResourceDefinition } from "./ModuleResourceDefitinion.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let moduleId : Partial<ResourceColumnDefinition> = {
    name : "Module ID",
    columnName : "module_id",
    nullable : false,
    primary : false,
    autoIncrement : false,
    references : {
        tableName : ModuleResourceDefinition.tableName,
        columnName : DefaultIdColumnDefinition.columnName,
        onDelete : "RESTRICT",
        onUpdate : "CASCADE"
    }
};

export const ModuleIdReferenceColumnDefinition : ResourceColumnDefinition = Object.assign({}, DefaultIdColumnDefinition, moduleId);