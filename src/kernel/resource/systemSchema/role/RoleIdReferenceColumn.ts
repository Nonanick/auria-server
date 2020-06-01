import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let roleId : Partial<ResourceColumnDefinition> = {
    name: "Role ID",
    columnName: "role_id",
    nullable : false,
    primary : false,
    autoIncrement : false,
    references: {
        columnName : DefaultIdColumnDefinition.columnName,
        tableName : "Role",
        onDelete : "RESTRICT",
        onUpdate : "CASCADE"
    }
};

export const RoleIdReferenceColumnDefinition : ResourceColumnDefinition = Object.assign({} , DefaultIdColumnDefinition, roleId);