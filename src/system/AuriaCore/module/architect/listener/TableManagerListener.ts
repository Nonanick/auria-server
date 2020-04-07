import { ModuleListener } from "../../../../../kernel/module/ModuleListener";
import { Table } from "../../../../../kernel/database/structure/table/Table";
import { AuriaConnection } from "../../../../../kernel/database/connection/AuriaConnection";
import { SystemUser } from "../../../../../kernel/security/SystemUser";
import { AuriaArchitect } from "../AuriaArchitect";
import { DatabaseSychronizer } from "../databaseManipulation/DatabaseSynchronizer";
import { ListenerActionsMetadata, ListenerAction } from "../../../../../kernel/module/ListenerAction";

export class TableManagerListener extends ModuleListener {

    private dbSync: Map<number, DatabaseSychronizer>;

    constructor(module: AuriaArchitect) {
        super(module, "TableManagerListener");

        this.dbSync = new Map();

    }


    public getExposedActionsMetadata(): ListenerActionsMetadata {
        return {
            "list": {},
            "databaseSync": {},
            "situation": {},
        };
    }

    protected getDatabaseSynchronizer(conn: number) {
        if (!this.dbSync.has(conn)) {
            let sync = new DatabaseSychronizer(
                this.module.getSystem(),
                this.module.getSystem().getSystemConnection()
            );

            this.dbSync.set(conn, sync);
        }
        return this.dbSync.get(conn)!;
    }

    public situation: ListenerAction = (req) => {

        //let table = req.requiredParam("table");
        //let user = req.getUser();

        /*this.module.getTable(user, table)
            .then(tableO => {
                let dbSync = this.getDatabaseSynchronizer(1);
                return dbSync.compareAuriaTable(tableO);
            })
            .then(comparisson => {
                return comparisson.asJson();
            })
            .then(ansJson => {
                res.addToResponse(ansJson);
                res.send();
            });*/
    };

    public databaseSync: ListenerAction = (req) => {

        //let tableName = req.requiredParam("table");
        //let user = req.getUser();

        /*this.module
            .getTable(user, tableName)
            .then(async (table: Table) => {
                let conn = table.getConnection();
                await table.buildColumns();
                return [table, await this.fetchTableDescription(conn, table.table)];
            })
            .then(([table, result]) => {
                (result as DescribeTableResult[]).forEach((colDescription) => {
                    let comparisson = this.compareColumnDescripion(colDescription, table);
                    this.syncComparissonWithAuria(user, table, comparisson);
                });

                res.send();
            })
            .catch((err: any) => {
                console.error("[Architect.TableManager] Failed to fetch table from parameter!", err);
                res.error("", "User can't access this table!");
            });*/

    };

    protected syncComparissonWithAuria(user: SystemUser, table: Table, comparisson: ColumnComparisson) {
        switch (comparisson.status) {
            case 'new':
                this.createColumnFromComparisson(user, table, comparisson);
                break;
            case 'unsynced':
                this.syncColumnWithComparisson(user, table, comparisson);
                break;
            case 'sync':
                break;
        }
    }

    private async createColumnFromComparisson(user: SystemUser, table: Table, comparisson: ColumnComparisson) {
        throw new Error("Not implemented yet");
        /*
                try {
        
                    let [colTable, txtResTable] = await Promise.all([
                        this.module.getTable(user, "Auria.Collumn"),
                        this.module.getTable(user, "Auria.TextResource")]
                    );
        
                    let colName = this.toCamelCase(comparisson.outOfSync!.field);
                    let colTitleKey = "@{Auria.Columns.Title." + table.getName() + "." + colName + "}";
                    let colDescriptionKey = "@{Auria.Columns.Description." + table.getName() + "." + colName + "}";
                    let dataType = this.rawTypeToDataType(comparisson.outOfSync!.type!);
        
                    // # - Create and save column
                    let col = new RowModel(colTable!);
                    col.setAttribute({
                        name: colName,
                        column: comparisson.outOfSync!.field,
                        table_name: table.table,
                        title: colTitleKey,
                        description: colDescriptionKey,
                        table_type: "physic",
                        data_type: dataType,
                        attributes: comparisson.outOfSync!.key,
                        required: 1,
                        allow_modification: 1,
                        active: 1
                    });
                    col.save(user);
        
                    // # - Create and save text resources
                    let title = new RowModel(txtResTable!);
                    title.setAttribute({
                        lang: "en",
                        variation: "us",
                        name: colTitleKey,
                        value: colName
                    });
                    title.save(user);
        
                    let description = new RowModel(txtResTable!);
                    description.setAttribute({
                        lang: "en",
                        variation: "us",
                        name: colDescriptionKey,
                        value: "Column Generated by Auria and currently does not have a description"
                    });
                    description.save(user);
                }
                catch (err) {
                    console.error("[TableManager] Failed to create column!", err);
                }*/
    }

    public rawTypeToDataType(type: string) {

        let ret = "String";

        let rawTypeIndex = type.indexOf('(') >= 0 ? type.indexOf('(') : type.length;
        let rawType = type.slice(0, rawTypeIndex).toLocaleLowerCase();

        let stringDataType = [
            "varchar", "text", "char", "tintext", "longtext", "mediumtext"
        ];

        let numberDataType = [
            "tinyint", "bigint", "float", "int", "bit", "smallint", "double", "decimal"
        ];

        let timeDataType = [
            "timestamp", "datetime", "date", "time", "year"
        ];

        if (numberDataType.indexOf(rawType) >= 0) {
            ret = "Number";
        }

        if (stringDataType.indexOf(rawType) >= 0) {
            ret = "String";
        }

        if (timeDataType.indexOf(rawType) >= 0) {
            ret = "DateTime";
        }

        return ret;
    }


    public toCamelCase(str: string, join = ""): string {

        let pcs = str.split(/[- _]/g);
        let upper = pcs.map(val => val.toLocaleUpperCase());

        return upper.join(join);

    }

    protected async syncColumnWithComparisson(user: SystemUser, table: Table, comparisson: ColumnComparisson) {

    }

    protected async fetchTableDescription(conn: AuriaConnection, table: string) {
        return conn.query("DESCRIBE `" + table + "`", []);
    }

    protected compareColumnDescripion(description: DescribeTableResult, table: Table): ColumnComparisson {

        if (table.hasColumn(description.Field)) {

        } else {
            return { status: "new" };
        }

        return { status: "sync" };
    }



}

type DescribeTableResult = {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string;
    Extra: string;
};

type ColumnComparisson = {
    status: "sync" | "new" | "unsynced";
    outOfSync?: {
        field: string;
        type?: string;
        key?: string;
        defaultValue?: string;
        nullable?: boolean;
    };
};