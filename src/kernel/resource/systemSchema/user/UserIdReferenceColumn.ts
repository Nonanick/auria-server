import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { UserResourceDefinition } from "./UserResourceDefinition.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let userId : Partial<ResourceColumnDefinition> = {
    name: "User ID",
    columnName: "user_id",
    nullable : false,
    primary : false,
    autoIncrement : false,
    references: {
        columnName : DefaultIdColumnDefinition.columnName,
        tableName : UserResourceDefinition.tableName,
        onDelete : "RESTRICT",
        onUpdate : "CASCADE"
    }
};

export const UserIdReferenceColumnDefinition : ResourceColumnDefinition = Object.assign({} , DefaultIdColumnDefinition, userId);