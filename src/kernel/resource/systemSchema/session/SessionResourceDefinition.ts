import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { UserResourceDefinition } from "../user/UserResourceDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";
import { asResource } from "../../Resource.js";

export const SessionResourceDefinition = asResource({
    name: "Session",
    tableName: "Session",
    title: "@{Auria.Resource.Session.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        Username: {
            name: "Username",
            columnName: "username",
            sqlType: "VARCHAR",
            nullable: false,
            length: 255,
            references: {
                columnName: UserResourceDefinition.columns.Username.columnName,
                tableName: UserResourceDefinition.tableName,
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            }

        },
        Token: {
            name: "Token",
            columnName: "token",
            sqlType: "TEXT",
            nullable: false,
        },
        LoginTime: {
            name: "Login Time",
            columnName: "login_time",
            sqlType: "DATETIME",
            nullable: false,
        },
        Status: DefaultStatusColumnDefinition,
    }
});