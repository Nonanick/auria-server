import { Table } from "../../../../../kernel/database/structure/table/Table";
import { AuriaConnection } from "../../../../../kernel/database/connection/AuriaConnection";
import { TableCompareResult } from "./TableCompareResult";
import { SQLType, ConnectionColumnDefinition } from "./definitions/ConnectionColumnDefinition";
export declare class TableComparisson {
    /**
     * Table
     * -----
     */
    private table;
    private connTable;
    private buildDefinitionPromise;
    private connection;
    constructor(connection: AuriaConnection);
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
    setAuriaTable(table: Table): this;
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
    setConnectionTable(table: string): this;
    /**
     * [Create] Definition, based on Auria.Table
     * ------------------------------------------
     *
     * Generates a TableDefinition based on a Auria.Table
     *
     * @param table Auria.Table
     */
    private createDefinitionFromAuriaTable;
    private buildColumnDefinitionFromAuriaColumn;
    private createDefinitionFromDbTable;
    private buildColumnsFromDbTable;
    createColumnDefinitionFromDescribeResult(describeRes: DescribeTableResult): ConnectionColumnDefinition;
    compare(): Promise<TableCompareResult>;
    private compareColumnDefinitions;
}
declare type DescribeTableResult = {
    Field: string;
    Type: SQLType;
    Null: string;
    Key: string;
    Default: string;
    Extra: string;
};
export {};
