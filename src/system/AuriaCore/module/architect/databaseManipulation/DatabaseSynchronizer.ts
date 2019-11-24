import { System } from "../../../../../kernel/System";
import { AuriaConnection } from "../../../../../kernel/database/connection/AuriaConnection";
import { TableCompareResult } from "./TableCompareResult";
import { Table } from "../../../../../kernel/database/structure/table/Table";

export class DatabaseSychronizer {

    /**
     * Auria System
     * ------------
     */
    public system: System;

    /**
     * Connection
     * ----------
     * 
     */
    private connection: AuriaConnection;

    private showTablesPromise: Promise<string[]>;

    constructor(system: System, connection: AuriaConnection) {
        this.system = system;
        this.connection = connection;
    }

    /**
     * Get Tables From Connection
     * --------------------------
     * 
     * Return the Promise result of the "SHOW TABLES" query
     */
    public async getTablesFromConnection(): Promise<string[]> {
        if (this.showTablesPromise == null)
            this.renewTablesFromConnection();

        return this.showTablesPromise;
    }

    /**
     * [Renew] Tables From Connection
     * -------------------------------
     * 
     * Perform a new "SHOW TABLES" query in the current database
     * the query result is cached in the promise
     */
    public renewTablesFromConnection(): Promise<string[]> {
        this.showTablesPromise = this.connection
            .query("SHOW TABLES", [])
            .then(tableRes => {

                let ret: string[] = [];
                tableRes.forEach((tab: any) => {
                    for (var c in tab) {
                        if (tab.hasOwnProperty(c)) {
                            ret.push(tab[c]);
                        }
                    }
                });

                console.log("[DatabaseSynchronizer] Tables in Connections: ", ret);
                return ret;
            });

        return this.showTablesPromise;
    }

    /**
     * Tables in Auria
     * ---------------
     * 
     * Check which tables from the database are already present in 
     * Auria;
     */
    public async tablesInAuria(): Promise<string[]> {
        throw new Error("To be implemented");/*
        return Promise
            .all([
                // SHOW TABLES in database
                this.getTablesFromConnection(),
                // Check tables in Auria.Table
                // @todo, filter by connection!
                this.system.getData().listAllTables("table")
            ])
            .then(([tablesInConnection, tablesInAuria]) => {
                let ret: string[] = [];
                // # - Traverser Tables in Connection list
                tablesInConnection.forEach((tIC) => {
                    // # - heck if the ARE in Auria
                    if (tablesInAuria.indexOf(tIC) >= 0) {
                        ret.push(tIC);
                    }
                });
                return ret;
            });*/
    }


    /**
     * Tables NOT in Auria
     * --------------------
     * 
     * Check which tables are in the database and are not imported
     * to the Auria System
     */
    public async tablesNotInAuria() {
        throw new Error("To be implemented");
        /*
        return Promise
            .all([
                // SHOW TABLES in database
                this.getTablesFromConnection(),
                // Check tables in Auria.Table
                // @todo, filter by connection!
                this.system.getData().listAllTables("table")
            ])
            .then(([tablesInConnection, tablesInAuria]) => {
                let ret: string[] = [];
                // # - Traverse Table in Connections list
                tablesInConnection.forEach((tIC) => {
                    // # - Check if the are NOT in Auria
                    if (tablesInAuria.indexOf(tIC) < 0) {
                        ret.push(tIC);
                    }
                });
                return ret;
            });*/
    }

    /**
     * Tables ONLY in Auria
     * --------------------
     * 
     * Check which table definitions are present in Auria and does not have
     * a counterpart in the database;
     */
    public async tablesOnlyInAuria() {
        throw new Error("To be iplemented!");/*
        return Promise
            .all([
                // SHOW TABLES in database
                this.getTablesFromConnection(),
                // Check tables in Auria.Table
                // @todo, filter by connection!
                this.system.getData().listAllTables("table")
            ])
            .then(([tablesInConnection, tablesInAuria]) => {
                let ret: string[] = [];
                // # Traverse Tables In Auria list
                tablesInAuria.forEach((tIA) => {
                    // # - Check if they're not present in the connection!
                    if (tablesInConnection.indexOf(tIA) < 0) {
                        ret.push(tIA);
                    }
                });
                return ret;
            });*/
    }

    public async compareAuriaTable(table: Table): Promise<TableCompareResult> {
        /*
        let tableOnlyInAuria = await this.tablesOnlyInAuria();
        
        console.log("[Architect.DbSync] Tables only in Auria:", tableOnlyInAuria);

        let comparisson: TableComparisson = new TableComparisson(this.connection);

        comparisson.setAuriaTable(table);

        if (tableOnlyInAuria.indexOf(table.table) < 0) {
            comparisson.setConnectionTable(table.table);
        }

        return comparisson.compare();*/
        throw new Error("To be implemented!");
    }

}