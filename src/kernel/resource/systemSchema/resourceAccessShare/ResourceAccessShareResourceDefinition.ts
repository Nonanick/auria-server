import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ResourceIdReferenceColumnDefinition } from "../resource/ResourceIdReferenceColumn.js";
import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { ResourceRowIdColumnDefinition } from "../resourceAccessPolicy/columns/ResourceRowIdColumnDefinition.js";
import { RoleIdReferenceColumnDefinition } from "../role/RoleIdReferenceColumn.js";
import { DataProcedureColumnDefinition } from "../resourcePermission/columns/DataProcedureColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ResourceAccessShareResourceDefinition = asResource({
    name: "Resource Access Share",
    tableName: "Resource_Access_Share",
    title: "@{Auria.Resource.ResourceAccessShare.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,

        // Resource that was shared
        ResourceID: ResourceIdReferenceColumnDefinition,
        ResourceRowID: ResourceRowIdColumnDefinition,

        // Who shared it (User / Role)
        UserAuthority: Object.assign({},  UserIdReferenceColumnDefinition,{ name: "User Authority", columnName: "user_authority" }),
        RoleAuthority: Object.assign({}, RoleIdReferenceColumnDefinition, { name: "Role Authority", columnName: "role_authority" }),

        // Who will gain access to it
        SharedUserID: Object.assign({}, UserIdReferenceColumnDefinition, { name: "Shared User ID", columnName: "shared_user_id" }),
        SharedRoleID: Object.assign({}, RoleIdReferenceColumnDefinition,  { name: "Shared Role ID", columnName: "shared_role_id" }),

        // What procedures were given to the user
        Procedure: DataProcedureColumnDefinition,

        Status: DefaultStatusColumnDefinition,
    }
});