import { ModuleListener } from "../../../../../kernel/module/api/ModuleListener.js";
import { AuriaListenerActionMetadata } from "../../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { OnlyAdminsCanAccessArchitect } from "../../../../accessRules/OnlyAdminsCanAccessArchitect.js";
import { ArchitectListenerAction } from "../../../../request/ArchitectListenerAction.js";
import { ResourceModule } from "../../ResourceModule.js";
import Knex from "knex";
import { InvalidParameter } from "../../../../../kernel/exceptions/InvalidParameter.js";
import { SQLTableDescription } from "./SQLTableDescription.js";
import { ResourceRowData } from "./ResourceRowData.js";
import { ResourceResourceDefinition } from "../../../../../kernel/resource/systemSchema/resource/ResourceResourceDefinition.js";
import { ColumnRowData } from "./ColumnRowData.js";

export class DatabaseListener extends ModuleListener {

    constructor(module: ResourceModule) {
        super(module, "Database");
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
        return {
            "allTables": {
                DISABLE_BLACKLIST_RULE: true,
                DISABLE_WHITELIST_RULE: true,
                accessRules: [OnlyAdminsCanAccessArchitect]
            },
            "describeTable": {
                DISABLE_WHITELIST_RULE: true,
                DISABLE_BLACKLIST_RULE: true,
                accessRules: [OnlyAdminsCanAccessArchitect]
            },
            "saveTable": {
                DISABLE_BLACKLIST_RULE: true,
                DISABLE_WHITELIST_RULE: true,
                accessRules: [OnlyAdminsCanAccessArchitect]
            }
        }
    }

    public allTables: ArchitectListenerAction = (req) => {

        let dbConnection = req.connection;

        if (req.hasParam("connection")) {
            // TODO: load connection based on ID
        }

        return this.allTablesInConnection(dbConnection);

    };

    public describeTable: ArchitectListenerAction = (req) => {
        let tableName = req.getRequiredParam('table');

        return this.allTablesInConnection(req.connection)
            .then((tables) => {

                if (tables.indexOf(tableName) < 0) throw new InvalidParameter("The table passed does not exists in the specified connection");

                return req.connection
                    .withSchema("information_schema")
                    .table("columns")
                    .where("columns.table_name", tableName)
                    .andWhere("columns.table_schema", req.connection.client.database())
                    .select(
                        "columns.column_name",
                        "columns.ordinal_position as position",
                        "columns.column_default as default",
                        "columns.is_nullable as null",
                        "columns.data_type",
                        "columns.character_maximum_length as max_length",
                        "columns.numeric_precision as max_number",
                        "columns.extra",
                        "columns.column_key",
                        "columns.column_comment as comment",
                        "key_column_usage.referenced_table_schema as reference_schema",
                        "key_column_usage.referenced_table_name as reference_name",
                        "key_column_usage.referenced_column_name as reference_column"
                    )
                    .leftJoin("key_column_usage", function () {
                        return this
                            .on("key_column_usage.table_schema", "=", "columns.table_schema")
                            .andOn("key_column_usage.table_name", "=", "columns.table_name")
                            .andOn("key_column_usage.column_name", "=", "columns.column_name")
                    });
            })
            .then((columns: SQLTableDescription[]) => {
                return columns;
            });
    };

    public saveTable: ArchitectListenerAction = (req) => {
        const tableData: ResourceRowData = req.getRequiredParam('data');
        //const options : ResourceCreationOptions = req.getOptionalParam('options', {});


        return req.connection
            .insert({
                ...tableData
            })
            .into(ResourceResourceDefinition.tableName)
            .returning(ResourceResourceDefinition.columns.ID.columnName)
            .then((resourceId) => {
                if (Array.isArray(resourceId))
                    if (resourceId.length == 1)
                        return resourceId[0];
                return null;
            });

    };

    public saveColumn : ArchitectListenerAction = (req) => {
        const columnData : ColumnRowData = req.getRequiredParam("data");
        console.log("Creation Column:> ", columnData);
    };

    protected async allTablesInConnection(conn: Knex): Promise<string[]> {
        const allTables: string[] = [];
        return conn.raw("SHOW TABLES")
            .then(([asArray, infoSchema]) => {
                (asArray as any[]).forEach((tableNameObject) => {
                    allTables.push(
                        Array.from(
                            Object.values(tableNameObject)
                        )[0] as string
                    );
                });

                return allTables;
            });
    }

}
