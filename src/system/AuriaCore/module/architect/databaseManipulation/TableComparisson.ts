import { Table } from "../../../../../kernel/database/structure/table/Table";
import { AuriaConnection } from "../../../../../kernel/database/connection/AuriaConnection";
import { TableCompareResult, ColumnSyncSituation } from "./TableCompareResult";
import { ConnectionTableDefinition } from "./definitions/ConnectionTableDefinition";
import { SQLType, ConnectionColumnDefinition } from "./definitions/ConnectionColumnDefinition";
import { Column } from "../../../../../kernel/database/structure/column/Column";


export class TableComparisson {

    /**
     * Table
     * -----
     */
    private table: Table;

    private connTable: string;

    private buildDefinitionPromise: {
        db?: Promise<ConnectionTableDefinition>;
        auria?: Promise<ConnectionTableDefinition>;
    } = {};

    private connection: AuriaConnection;

    constructor(connection: AuriaConnection) {
        this.connection = connection;
    }

    /**
     * Set Auria Table
     * ----------------
     * 
     * Defines an Auria Table to be compared
     * Generates a TableDefinition, class used to intermediate
     * the sync between Auria.Table and the Database table;
     * 
     * @param table AuriaTable
     */
    public setAuriaTable(table: Table) {
        this.table = table;
        this.createDefinitionFromAuriaTable(table);
        return this;
    }

    /**
     * Set Connection Table
     * --------------------
     * 
     * Defines a database table t be compared
     * Generates a TableDefinition, class used to intermediate
     * the sync between Auria.Table and the Database Table;
     * 
     * @param table Database Table
     */
    public setConnectionTable(table: string) {
        this.connTable = table;
        this.createDefinitionFromDbTable(table);
        return this;
    }

    /**
     * [Create] Definition, based on Auria.Table
     * ------------------------------------------
     * 
     * Generates a TableDefinition based on a Auria.Table
     *  
     * @param table Auria.Table
     */
    private async createDefinitionFromAuriaTable(table: Table): Promise<ConnectionTableDefinition> {
        this.buildDefinitionPromise.auria =
            Promise.resolve()
                .then(_ => table.getColumns())
                .then(cols => {
                    let def = new ConnectionTableDefinition();
                    def.name = table.table;
                    let colDef: ConnectionColumnDefinition[] = [];
                    cols.forEach((auriaCol) => {
                        colDef.push(this.buildColumnDefinitionFromAuriaColumn(auriaCol));
                    });
                    def.columns = colDef;

                    return def;
                });

        return this.buildDefinitionPromise.auria!;
    }

    private buildColumnDefinitionFromAuriaColumn(auriaCol: Column): ConnectionColumnDefinition {
        let def = new ConnectionColumnDefinition(auriaCol.column);

        def.default = auriaCol.getDefaultValue();
        def.isPrimary = auriaCol.isPrimaryKey();
        def.length = auriaCol.getMaxLength();
        def.null = auriaCol.isNullable() ? "YES" : "NO";
        def.setExtra(auriaCol.getExtra());
        def.setSQLType(auriaCol.getRawType());

        return def;
    }

    private async createDefinitionFromDbTable(tableName: string): Promise<ConnectionTableDefinition> {
        this.buildDefinitionPromise.db =
            Promise.resolve()
                .then(_ => this.buildColumnsFromDbTable(tableName))
                .then(cols => {
                    let def = new ConnectionTableDefinition();
                    def.name = tableName;
                    def.columns = cols;
                    return def;
                });

        return this.buildDefinitionPromise.db!;
    }

    private async buildColumnsFromDbTable(tableName: string) {
        return this.connection
            .query("DESCRIBE `" + tableName + "`", [])
            .then((res: DescribeTableResult[]) => {
                let columns: ConnectionColumnDefinition[] = [];
                res.forEach((colDef) => {
                    let col = this.createColumnDefinitionFromDescribeResult(colDef);
                    columns.push(col);
                });
                return columns;
            });
    }

    public createColumnDefinitionFromDescribeResult(describeRes: DescribeTableResult) {

        let col = new ConnectionColumnDefinition(describeRes.Field);

        col.setSQLType(describeRes.Type);
        col.default = describeRes.Default;
        col.setExtra(describeRes.Extra);
        col.setKey(describeRes.Key);
        col.isPrimary = describeRes.Key.toLocaleUpperCase().indexOf("PRI") >= 0;
        col.null = describeRes.Null;

        return col;
    }

    public async compare(): Promise<TableCompareResult> {

        if (this.table == null && this.connTable == null) {
            throw new Error("[TableComparisson] Nothing to compare! Both Tables definitions are empty!");
        }

        let res = new TableCompareResult();
        
        if (this.table == null || this.connTable == null) {
            res.tableSituation = this.table == null ? "onlyInConnection" : "onlyInAuria";
        }

        if (this.connTable != null && this.table != null) {
            // # - Initially considered synced
            res.tableSituation = "synced";

            // # - Load the definitions
            let aDef = await this.buildDefinitionPromise.auria!;
            let cDef = await this.buildDefinitionPromise.db!;

            console.log("[TableComparisson] Now comparing Tables:", aDef, cDef);

            // # - Load Auria Columns Definitions
            aDef.columns.forEach((c) => {
                let cName = c.getName();
                res.columns[cName] = { auria: c };
            });

            // # - Load Connection Columns Definitions
            cDef.columns.forEach((c) => {
                let cName = c.getName();
                res.columns[cName] = Object.assign({ db: c }, res.columns[cName]);
            });

            // # - Compare each column value
            for (var columnName in res.columns) {
                if (res.columns.hasOwnProperty(columnName)) {
                    let column = res.columns[columnName];
                    let compareRes = await this.compareColumnDefinitions(column.db, column.auria);
                    res.columns[columnName].situation = compareRes;
                    if (compareRes != "synced") {
                        res.tableSituation = "unsynced";
                    }
                }
            }
        }

        return res;
    }

    private async compareColumnDefinitions(dbDef?: ConnectionColumnDefinition, auriaDef?: ConnectionColumnDefinition): Promise<ColumnSyncSituation> {

        console.log("[TableComparisson] Now comparing:\n", dbDef, auriaDef);

        if (dbDef == null && auriaDef == null)
            throw new Error("[TableComparisson] Nothing to compare, both definitions are empty!");

        if (dbDef == null) {
            return "onlyInAuria";
        }

        if (auriaDef == null) {
            return "onlyInConnection";
        }

        let status: ColumnSyncSituation = "synced";

        let auriaJson: any = auriaDef.asJson();
        let connJson: any = dbDef.asJson();

        for (var prop in auriaJson) {
            if (auriaJson.hasOwnProperty(prop)) {
                if (auriaJson[prop] != connJson[prop]) {
                    status = "unsynced";
                }
            }
        }

        return status;
    }

}


type DescribeTableResult = {
    Field: string;
    Type: SQLType;
    Null: string;
    Key: string;
    Default: string;
    Extra: string;
};