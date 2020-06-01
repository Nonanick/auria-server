import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { RoleIdReferenceColumnDefinition } from "../role/RoleIdReferenceColumn.js";
import { ResourceIdReferenceColumnDefinition } from "../resource/ResourceIdReferenceColumn.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { DataProcedureColumnDefinition } from "./columns/DataProcedureColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ResourcePermissionResourceDefinition = asResource({
    name: "Resource Permission",
    tableName: "Resource_Permission",
    title: "@{Auria.Resource.ResourcePermission.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        UserID: Object.assign({},  UserIdReferenceColumnDefinition, { nullable: true }),
        RoleID: Object.assign({}, RoleIdReferenceColumnDefinition, { nullable: true }),
        ResourceID: ResourceIdReferenceColumnDefinition,
        Procedure: DataProcedureColumnDefinition,
        Status: DefaultStatusColumnDefinition,
    }
});

export type ResourceDataProcedures = "READ" | "UPDATE" | "DELETE" | "CREATE" | "RESTORE";