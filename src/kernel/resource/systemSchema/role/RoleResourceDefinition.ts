import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { DefaultDescriptionColumnDefinition } from "../defaultColumns/DefaultDescriptionColumnDefinition.js";
import { RoleIdReferenceColumnDefinition } from "./RoleIdReferenceColumn.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";
import { asResource } from "../../Resource.js";

export const RoleResourceDefinition = asResource({
    name: "Role",
    tableName: "Role",
    title: "@{Auria.Resource.Role.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        Name: DefaultNameColumnDefinition,
        Title: DefaultTitleColumnDefinition,
        Icon: {
            name: "Icon",
            columnName: "icon",
            sqlType: "VARCHAR",
            length: 255,
            nullable: true,
        },
        Description: DefaultDescriptionColumnDefinition,
        ParentRole: Object.assign({}, RoleIdReferenceColumnDefinition, { name: "Parent Role", columnName: "parent_role" }),
        Status: DefaultStatusColumnDefinition,
    }
});