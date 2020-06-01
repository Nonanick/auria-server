import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let modMenuId : Partial<ResourceColumnDefinition> = {
    name : "Module Menu ID",
    columnName : "module_menu_id",
    nullable : false,
    primary : false,
    autoIncrement : false,
    references : {
        tableName : "Module_Menu",
        columnName : DefaultIdColumnDefinition.columnName,
        onUpdate : "CASCADE",
        onDelete : "RESTRICT"
    }
};

export const ModuleMenuIdReferenceColumnDefinition : ResourceColumnDefinition = Object.assign({},  DefaultIdColumnDefinition, modMenuId);