import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { ConnectionHostColumnDefinition } from "./columns/ConnectionHostColumnDefinition.js";
import { ConnectionDriverColumnDefinition } from "./columns/ConnectionDriverColumnDefinition.js";
import { ConnectionDatabaseColumnDefinition } from "./columns/ConnectionDatabaseColumnDefinition.js";
import { ConnectionUsernameColumnDefinition } from "./columns/ConnectionUsernameColumnDefinition.js";
import { ConnectionPasswordColumnDefinition } from "./columns/ConnectionPasswordColumnDefinition.js";
import { DefaultStatusColumnDefinition } from "../defaultColumns/DefaultStatusColumnDefinition.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";


export const ConnectionTableDefinition = asResource({
    name: "Connection",
    tableName: "Connection",
    title: "@{Auria.Table.Connection.Title}",
    description: "[SystemTable] Connections used by the system to manage resources controlled by Auria",
    connection: SystemConnectionDefinition,
    columns: {
        ID: DefaultIdColumnDefinition,
        Name: DefaultNameColumnDefinition,
        Title: DefaultTitleColumnDefinition,
        Host: ConnectionHostColumnDefinition,
        Driver: ConnectionDriverColumnDefinition,
        Database: ConnectionDatabaseColumnDefinition,
        Username: ConnectionUsernameColumnDefinition,
        Password: ConnectionPasswordColumnDefinition,
        Status: DefaultStatusColumnDefinition,
    },
    unique: {
        "UNIQUE_DB_USER_IN_HOST": ["host", "database", "username"]
    }
});

export type ConnectionTableDefinitionType = typeof ConnectionTableDefinition;