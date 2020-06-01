import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ResourceIdReferenceColumnDefinition } from "../resource/ResourceIdReferenceColumn.js";
import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { RoleIdReferenceColumnDefinition } from "../role/RoleIdReferenceColumn.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { DataProcedureColumnDefinition } from "../resourcePermission/columns/DataProcedureColumnDefinition.js";
import { ResourceRowIdColumnDefinition } from "./columns/ResourceRowIdColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ResourceAccessPolicyResourceDefinition= asResource({
    name: "Resource Access Policy",
    tableName: "Resource_Access_policy",
    title: "@{Auria.Resource.ResourceAccessPolicy.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        ResourceID: ResourceIdReferenceColumnDefinition,
        UserID: Object.assign({}, UserIdReferenceColumnDefinition, { nullable: true }),
        RoleID: Object.assign({}, RoleIdReferenceColumnDefinition, { nullable: true }),
        ResourceRowID: ResourceRowIdColumnDefinition,
        Procedure : DataProcedureColumnDefinition,
        Status : DefaultStatusColumnDefinition
    },
    checkConstraints : {
        "USER_OR_ROLE_ID_MUST_BE_FILLED" : "user_id IS NOT NULL OR role_id IS NOT NULL"
    }
});