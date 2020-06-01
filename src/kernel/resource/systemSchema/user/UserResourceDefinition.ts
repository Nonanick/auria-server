import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";
import { asResource } from "../../Resource.js";

export const UserResourceDefinition = asResource({
    name : "User",
    tableName : "User",
    connection : SystemConnectionDefinition,
    title : "@{Auria.Resource.User.Title}",
    columns : {
        ID : DefaultIdColumnDefinition,
        Username : {
            name : "Username",
            columnName :"username",
            sqlType : "VARCHAR",
            length : 255,
            nullable : false,
            unique : true,
        },
        Password : {
            name : "Password",
            columnName : "password",
            sqlType :"VARCHAR",
            length : 255,
            nullable : false,
        },
        UserPrivilege : {
            name : "User Privilege",
            columnName :"user_privilege",
            sqlType : "INT",
            length : 5,
            default : 0,
        },
        Status : DefaultStatusColumnDefinition,
    },
    description : "Users from this system"
});