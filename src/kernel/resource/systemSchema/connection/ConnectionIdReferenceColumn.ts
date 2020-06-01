import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ConnectionTableDefinition } from "./ConnectionResourceDefinition.js";
import { ResourceColumnDefinition } from "../../ResourceColumn.js";

let connId: Partial<ResourceColumnDefinition> = {
    name: "Connection ID",
    columnName: "connection_id",
    primary: false,
    autoIncrement: false,
    nullable: false,
    references: {
        columnName: DefaultIdColumnDefinition.columnName,
        tableName: ConnectionTableDefinition.tableName,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    }
};

export const ConnectionIdReferenceColumnDefinition: ResourceColumnDefinition = Object.assign({}, DefaultIdColumnDefinition, connId)