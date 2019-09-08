import { System } from "../System";
import { Table } from "./structure/table/Table";
import { TableRowData } from "./structure/table/TableRowData";
import { ObjectRepository } from "./object/ObjectRepository";
import { MysqlConnection } from "./connection/MysqlConnection";
import { RowModel } from "./structure/rowModel/RowModel";

export class TableManager {

    /**
     * System
     * -------
     */
    protected system: System;

    /**
     * Connection
     * -----------
     * 
     * System connection
     */
    protected connection: MysqlConnection;

    /**
     * Tables
     * -------
     * 
     * All the tables controlled by this system
     */
    protected tables: Map<string, Table>;

    /**
     * Promise: Build Tables
     * ---------------------
     * 
     * Resolved promise that build all the tables that belong to this system
     */
    protected buildTablesPromise: Promise<Map<string, Table>>;


    /**
     * Object Repository
     * ------------------
     * 
     * 
     */
    protected objectRepository: ObjectRepository;

    constructor(system: System) {

        this.system = system;
        this.connection = system.getSystemConnection();

        this.objectRepository = new ObjectRepository(system);
        RowModel.objectRepository = this.objectRepository;

        this.buildTables().then(
            (tableMap) => {
                this.tables = tableMap;
            }).catch((sqlErr) => {
                throw new Error("[Table Manager] Failed to load tables!\n" + sqlErr);
            });


    }

    // protected async buildDataTypes(): Promise<Map<string, DataType>> {
    //    // return DataTypeRepository.buildDataTypes(this.system);
    // }

    protected async buildTables(): Promise<Map<string, Table>> {
        if (this.buildTablesPromise != null) {
            return this.buildTablesPromise;
        }

        let promise = new Promise(
            (
                resolve: (value: Map<string, Table>) => void,
                reject: (reason: any) => void
            ) => {
                this.connection.query(
                    "SELECT \
                        name, title, description, connection_id, `table`, descriptive_column, distinctive_column \
                        FROM `table`",
                    []
                ).then((res) => {
                    let map = new Map<string, Table>();

                    (res as TableRowData[]).forEach((tb) => {

                        let table = new Table(this.system, tb.name);

                        table.connectionId = tb.connection_id;
                        table.table = tb.table;
                        table.title = tb.title;
                        table.descriptiveColumn = tb.descriptive_column;
                        table.description = tb.description;
                        table.distinctiveColumn = tb.distinctive_column;

                        table.buildColumns();

                        map.set(table.getName(), table);
                    });

                    resolve(map);
                }).catch((err) => {
                    reject("SQL Error: " + err.message);
                });
            });

        this.buildTablesPromise = promise;

        return promise;
    }

    public async getTables(): Promise<Map<string, Table>> {

        let promise = new Promise<Map<string, Table>>(async (resolve, reject) => {
            if (this.tables == null) {
                resolve(await this.buildTables());
            } else {
                resolve(this.tables);
            }
        });
        return promise;
    }

    public async getTable(table: string): Promise<Table> {
        let t: Table | null = null;
        try {
            let tables: Map<string, Table> = await this.getTables();
            t = tables.get(table) as Table;
        } catch (err) {
            console.error("[Table Manager] Failed to load table with name: ", table, "\n", err);
        }

        if (t == null) {
            throw new Error("[TableManager] Table does not exists '" + table + "'");
        }

        return t;
    }
}