import { System } from "../System";
import { Table } from "./structure/table/Table";
import { ObjectRepository } from "./object/ObjectRepository";
import Knex = require("knex");
export declare class TableManager {
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
    protected connection: Knex;
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
    constructor(system: System);
    protected buildTables(): Promise<Map<string, Table>>;
    getTables(): Promise<Map<string, Table>>;
    getTable(table: string): Promise<Table>;
}
