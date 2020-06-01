import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ModulePageIdReferenceColumnDefinition } from "../modulePage/ModulePageIdReferenceColumnDefinition.js";
import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { RoleIdReferenceColumnDefinition } from "../role/RoleIdReferenceColumn.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ModulePagePermissionResourceDefinition = asResource({
    name: "Module Page Permission",
    tableName : "Module_Page_Permission",
    title : "@{Auria.Resource.ModulePagePermission.Title}",
    description : "",
    connection : SystemConnectionDefinition,
    columns : {
        ID : DefaultIdColumnDefinition,
        PageID : ModulePageIdReferenceColumnDefinition,
        UserID : UserIdReferenceColumnDefinition,
        RoleID : RoleIdReferenceColumnDefinition,
        Status : DefaultStatusColumnDefinition,
    }
});
