import { System } from "../../../../../kernel/System";
import { TableCompareResult } from "./TableCompareResult";
import { Table } from "../../../../../kernel/database/structure/table/Table";
import Knex = require("knex");
export declare class DatabaseSychronizer {
    /**
     * Auria System
     * ------------
     */
    system: System;
    /**
     * Connection
     * ----------
     *
     */
    private connection;
    private showTablesPromise;
    constructor(system: System, connection: Knex);
    /**
     * Get Tables From Connection
     * --------------------------
     *
     * Return the Promise result of the "SHOW TABLES" query
     */
    getTablesFromConnection(): Promise<string[]>;
    /**
     * [Renew] Tables From Connection
     * -------------------------------
     *
     * Perform a new "SHOW TABLES" query in the current database
     * the query result is cached in the promise
     */
    renewTablesFromConnection(): Promise<string[]>;
    /**
     * Tables in Auria
     * ---------------
     *
     * Check which tables from the database are already present in
     * Auria;
     */
    tablesInAuria(): Promise<string[]>;
    /**
     * Tables NOT in Auria
     * --------------------
     *
     * Check which tables are in the database and are not imported
     * to the Auria System
     */
    tablesNotInAuria(): Promise<void>;
    /**
     * Tables ONLY in Auria
     * --------------------
     *
     * Check which table definitions are present in Auria and does not have
     * a counterpart in the database;
     */
    tablesOnlyInAuria(): Promise<void>;
    compareAuriaTable(table: Table): Promise<TableCompareResult>;
}
