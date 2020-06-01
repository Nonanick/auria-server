import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { DefaultDescriptionColumnDefinition } from "../defaultColumns/DefaultDescriptionColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { ModuleIdReferenceColumnDefinition } from "../module/ModuleIdReferenceColumnDefinition.js";
import { ModuleMenuIdReferenceColumnDefinition } from "../moduleMenu/ModuleMenuIdReferenceColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ModulePageResourceDefinition = asResource({
    name: "Module Page",
    tableName: "Module_Page",
    title: "@{Auria.Resource.ModulePage.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        ModuleID: ModuleIdReferenceColumnDefinition,
        ParentMenu: Object.assign({}, ModuleMenuIdReferenceColumnDefinition, { name: "Parent Menu", columnName: "parent_menu", nullable: true }),
        Name: DefaultNameColumnDefinition,
        Title: DefaultTitleColumnDefinition,
        Description: DefaultDescriptionColumnDefinition,
        Face: {
            name: "Face",
            columnName: "face",
            sqlType: "VARCHAR",
            length: 255,
            nullable: false,
        },
        Icon: {
            name: "Icon",
            columnName: "icon",
            sqlType: "VARCHAR",
            length: 255,
        },
        URL: {
            name: "URL",
            columnName: "url",
            sqlType: "VARCHAR",
            length: 255,
        },
        DataRequirements: {
            name: "Data Requirements",
            columnName: "data_requirements",
            sqlType: "JSON"
        },
        ApiRequirements: {
            name: "Api Requirements",
            columnName: "api_requirements",
            sqlType: "JSON"
        },
        ResourceBinding: {
            name: "Resource Binding",
            columnName: "resource_binding",
            sqlType: "VARCHAR",
            length: 255
        },
        ModelBinding: {
            name: "Model Binding",
            columnName: "model_binding",
            sqlType: "VARCHAR",
            length: 255
        },
        Status: DefaultStatusColumnDefinition,
    }
});