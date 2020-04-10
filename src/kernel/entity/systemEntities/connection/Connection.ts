import { SystemEntity } from "../../SystemEntity";
import { DefaultIdColumn, DefaultNameColumn, DefaultTitleColumn, DefaultStatusColumn } from "../../DefaultColumns";
import { HostColumn } from "./columns/HostColumn";
import { DriverColumn } from "./columns/DriverColumn";
import { DatabaseColumn } from "./columns/DatabaseColumn";
import { UsernameColumn } from "./columns/UsernameColumn";
import { PasswordColumn } from "./columns/PasswordColumn";

export class Connection extends SystemEntity {

    constructor() {
        super(ConnectionSystemEntityName);

        this.addColumns(
            // # Default Id, Name, Title columns
            new DefaultIdColumn(),
            new DefaultNameColumn(),
            new DefaultTitleColumn(),

            // # Connection specific columns
            new HostColumn(),
            new DriverColumn(),
            new DatabaseColumn(),
            new UsernameColumn(),
            new PasswordColumn(),

            // # Default Status column
            new DefaultStatusColumn()
        )
    }

}

export const ConnectionSystemEntityName = "Auria_Connection";