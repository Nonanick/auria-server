import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { ModuleIdReferenceColumnDefinition } from "../module/ModuleIdReferenceColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { DefaultDescriptionColumnDefinition } from "../defaultColumns/DefaultDescriptionColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { ModuleMenuIdReferenceColumnDefinition } from "./ModuleMenuIdReferenceColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ModuleMenuResourceDefinition = asResource({
    name: "Module Menu",
    tableName: "Module_Menu",
    title: "@{Auria.Resource.ModuleMenu.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        ModuleID: ModuleIdReferenceColumnDefinition,
        ParentMenuID: Object.assign({}, ModuleMenuIdReferenceColumnDefinition,  { name: "Parent Menu ID", columnName: "parent_menu_id", nullable: true }),
        Name: DefaultNameColumnDefinition,
        Title: DefaultTitleColumnDefinition,
        Description: DefaultDescriptionColumnDefinition,
        Icon: {
            name: "Icon",
            columnName: "icon",
            sqlType: "VARCHAR",
            length: 255
        },
        Color: {
            name: "Color",
            columnName: "color",
            sqlType: "VARCHAR",
            length: 255
        },
        URL: {
            name: "URL",
            columnName: "url",
            sqlType: "VARCHAR",
            length: 255
        },
        Status: DefaultStatusColumnDefinition,
    }
});