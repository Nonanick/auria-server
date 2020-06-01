import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ResourceIdReferenceColumnDefinition } from "../resource/ResourceIdReferenceColumn.js";
import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { RoleIdReferenceColumnDefinition } from "../role/RoleIdReferenceColumn.js";
import { DataProcedureColumnDefinition } from "../resourcePermission/columns/DataProcedureColumnDefinition.js";
import { ResourceRowIdColumnDefinition } from "../resourceAccessPolicy/columns/ResourceRowIdColumnDefinition.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";
import { asResource } from "../../Resource.js";

export const ResourceActivityResourceDefinition = asResource({
    name: "Resource Activity",
    tableName: "Resource_Activity",
    title: "@{Auria.Resource.ResourceActivity.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        // What resource was used
        ResourceID: ResourceIdReferenceColumnDefinition,
        // ID of the row modified
        ResourceRowID: ResourceRowIdColumnDefinition,
        // Which user was logged in
        UserID: UserIdReferenceColumnDefinition,
        // Under what role authority this procedure was made (can be null)
        RoleAuthority: Object.assign({}, RoleIdReferenceColumnDefinition, { name: "Role Authority", columnName: "role_authority", nullable: true }),
        // Under which user authority this procedure was made (may differ from logged user, might be null if role authority was used instead!)
        UserAuthority: Object.assign({}, RoleIdReferenceColumnDefinition, { name: "User Authority", columnName: "user_authority", nullable: true }),
        // What procedure was made
        Procedure: DataProcedureColumnDefinition,
        // Information to be provided by each procedure
        Extra: {
            name: "Extra Information",
            columnName: "extra_information",
            sqlType: "JSON",
            default: "",
            nullable: true
        }
    },
    checkConstraints: {
        "USER_OR_ROLE_AUTHORITY_CANT_BE_NULL": "role_authority IS NOT NULL OR user_authority IS NOT NULL"
    }
});