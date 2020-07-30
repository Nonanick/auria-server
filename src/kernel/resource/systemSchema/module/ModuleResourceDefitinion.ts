import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { DefaultDescriptionColumnDefinition } from "../defaultColumns/DefaultDescriptionColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ModuleResourceDefinition = asResource({
    name: "Module",
    tableName: "Module",
    title: "@{Auria.Resource.Module.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        System : {
            name : "System",
            columnName : "system",
            sqlType : "VARCHAR",
            nullable : false,
        },
        Name: DefaultNameColumnDefinition,
        Title: DefaultTitleColumnDefinition,
        Description: DefaultDescriptionColumnDefinition,
        Icon: {
            name: "Icon",
            columnName: "icon",
            sqlType: "VARCHAR",
            length: 255,
        },
        Color: {
            name: "Color",
            columnName: "color",
            sqlType: "VARCHAR",
            length: 255
        },
        Behaviour : {
            name : "Module Behaviour",
            columnName : "behaviour",
            sqlType : "VARCHAR",
            length : 50
        },

        Status: DefaultStatusColumnDefinition,
    },
    unique : {
        "UNIQUE_MODULE_IN_SYSTEM" : ["system","name"]
    },
    checkConstraints : {
        "BEHAVIOUR_MUST_BE_KNOWN" : "behaviour = 'Coded' OR behaviour = 'Hybrid' OR behaviour = 'Database'"
    }
});

export type ModuleBehaviour = "Coded" | "Hybrid" | "Database";