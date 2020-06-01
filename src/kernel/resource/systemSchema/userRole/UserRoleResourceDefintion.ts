import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { DefaultDescriptionColumnDefinition } from "../defaultColumns/DefaultDescriptionColumnDefinition.js";
import { RoleIdReferenceColumnDefinition } from "../role/RoleIdReferenceColumn.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const UserRoleResourceDefintion = asResource({
    name : "User Role Association",
    tableName :"User_Role",
    title : "@{Auria.Resource.UserRole.Title}",
    description : "",
    connection : SystemConnectionDefinition,
    columns : {
        ID : DefaultIdColumnDefinition,
        UserID : UserIdReferenceColumnDefinition,
        RoleID : RoleIdReferenceColumnDefinition,
        Name : DefaultNameColumnDefinition,
        Description : DefaultDescriptionColumnDefinition,
        Status : DefaultStatusColumnDefinition,
    },
    unique : {
        "UNIQUE_USER_ROLE_ASSOCIATION" : ["user_id","role_id"]
    }
});