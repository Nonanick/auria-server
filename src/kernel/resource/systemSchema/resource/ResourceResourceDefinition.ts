import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { ConnectionIdReferenceColumnDefinition } from "../connection/ConnectionIdReferenceColumn.js";
import { ResourceTableNameColumnDefinition } from "./columns/ResourceTableNameColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";
import { asResource } from "../../Resource.js";

export const ResourceResourceDefinition= asResource(  {
    connection: SystemConnectionDefinition,
    name: "Auria Resource",
    tableName: "Resource",
    title: "@{Auria.Resource.Resource.Title}",
    description: "",
    columns: {
        ID: DefaultIdColumnDefinition,
        Name: DefaultNameColumnDefinition,
        Title: DefaultTitleColumnDefinition,
        ConnectionID: ConnectionIdReferenceColumnDefinition,
        TableName : ResourceTableNameColumnDefinition,
        Status : DefaultStatusColumnDefinition
    }
});