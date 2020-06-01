import { UserIdReferenceColumnDefinition } from "../user/UserIdReferenceColumn.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const UserInfoResourceDefinition = asResource({
    name: "User Info",
    tableName: "User_Info",
    title: " @{Auria.Resource.UserInfo.Title}",
    description: "",
    connection: SystemConnectionDefinition,
    columns: {
        UserID: Object.assign({}, UserIdReferenceColumnDefinition, { unique: true }),
        Name: DefaultNameColumnDefinition,
        Surname: {
            columnName: "surname",
            name: "Surname",
            sqlType: "VARCHAR",
            length: 255,
        },
        Email: {
            columnName: "email",
            name: "Email",
            sqlType: "VARCHAR",
            length: 255,
        },
        Photo: {
            columnName: "photo",
            name: "Photo",
            sqlType: "VARCHAR",
            length: 255,
        }
    }
});