import { EventEmitter } from 'events';
import { ConnectionDefinition } from '../../connection/Connection';
import Knex, { TableBuilder, ColumnBuilder } from 'knex';
import { Bootable } from 'aurialib2';
import { DatabaseTableReflection } from './DatabaseTableReflection.js';
import { ResourceDefinition } from '../Resource.js';
import { DatabaseCompareResult } from './CompareResults.js';
import { ResourceColumnDefinition } from '../ResourceColumn.js';
import { System } from '../../System.js';
import { ConnectionNotFound } from '../../exceptions/kernel/connection/ConnectionNotFound.js';
import { TableAlreadyExists } from '../../exceptions/kernel/database/TableAlreadyExists.js';

export class DatabaseSynchronizer extends EventEmitter implements Bootable {

    private system: System;

    private connection: Knex;
    protected connDefinition: ConnectionDefinition;

    private showTablesPromise: Promise<string[]>;

    private tableReflections: {
        [tableName: string]: DatabaseTableReflection;
    } = {};

    constructor(system: System, connDefinition: ConnectionDefinition) {

        super();
        this.connDefinition = connDefinition;
        this.system = system;

        try {
            this.connection = this.system.getConnectionManager().getConnection(connDefinition.name);
        } catch (err) {
            if (err instanceof ConnectionNotFound) {
                this.connection = this.system.getConnectionManager().addConnection(connDefinition.name, connDefinition);
            } else {
                throw err;
            }
        }

    }

    public async compareResourceDefinitionWithDatabase(def: ResourceDefinition): Promise<DatabaseCompareResult> {

        let result: DatabaseCompareResult = {
            status: "NOT_IN_DB"
        };

        if (!(await this.connection.schema.hasTable(def.tableName)))
            return result;

            
        result.status = "SYNCED";

        return result;
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {
        throw new Error("Method not implemented.");
    }

    public reflectTable(tableName: string): DatabaseTableReflection {
        if (this.tableReflections[tableName] != null)
            return this.tableReflections[tableName];

        let reflection: DatabaseTableReflection = {
            columns: {}
        };

        return reflection;

    }

    public reflectColumn(columnName: string, tableName: string) {

    }

    /**
    * Get Tables From Connection
    * --------------------------
    * 
    * Return the Promise result of the "SHOW TABLES" query
    */
    protected async getTablesFromConnection(): Promise<string[]> {

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
    protected renewTablesFromConnection(): Promise<string[]> {

        this.showTablesPromise = this.connection
            .raw("SHOW TABLES")
            .then(tableRes => {

                let ret: string[] = [];
                tableRes.forEach((tab: any) => {
                    for (var c in tab) {
                        if (tab.hasOwnProperty(c)) {
                            ret.push(tab[c]);
                        }
                    }
                });

                console.log("[DatabaseSynchronizer] Tables in Connections: ", tableRes);
                return ret;
            });

        return this.showTablesPromise;
    }

    public async createTableFromDefinition(def: ResourceDefinition) {

        if (def.connection.name != this.connDefinition.name)
            throw new Error("[DatabaseSynchronizer] Resource contains a connection definition that does NOT match this Synchronizer connection!");


        if (await this.connection.schema.hasTable(def.tableName))
            throw new TableAlreadyExists("[DatabaseSynchronizer] Table already exists! " + def.tableName);

        let schema = this.connection.schema;
        schema.createTable(def.tableName, (builder) => {

            // Create tables
            for (var columnName in def.columns) {
                if (def.columns.hasOwnProperty(columnName)) {
                    let colDef = def.columns[columnName];
                    try {
                        this.createColumnFromDefinition(builder, colDef);
                    } catch (err) {
                        console.error("[DBSync] Failed to create column!");
                    }
                }
            }

            // Create unique keys
            if (def.unique != null)
                for (var uniqueKey in def.unique) {
                    if (def.unique.hasOwnProperty(uniqueKey)) {
                        let keys = def.unique[uniqueKey];
                        if (typeof keys == "string") keys = [keys];
                        builder.unique(keys, uniqueKey);
                    }
                }

            // Create common columns
            builder.timestamp("created_at").defaultTo(this.connection.raw('CURRENT_TIMESTAMP')).notNullable()
                .comment("Auria auto generated column that holds rows creation date/time");

            builder.timestamp("updated_at").defaultTo(this.connection.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable()
                .comment("Auria auto generated column that holds rows last edit date/time");

            builder.timestamp("deleted_at").defaultTo(null).nullable()
                .comment("Auria auto generated column that holds rows deletion date/time");

        })
            .then(() => {
                // Create Check constraints
                if (def.checkConstraints != null) {
                    let checkCnstr: string[] = [];

                    for (var checkKey in def.checkConstraints) {
                        if (def.checkConstraints.hasOwnProperty(checkKey)) {
                            let checks = def.checkConstraints[checkKey];
                            checkCnstr.push(`\n ADD CONSTRAINT \`${checkKey}\` CHECK (${checks}`);
                        }
                    }
                    if (checkCnstr.length != 0) {
                        let rawSQL = "ALTER TABLE `" + def.tableName + "`";
                        rawSQL += checkCnstr.join(", ");
                        this.connection.raw(rawSQL)
                    }
                }

            }).catch((err) => {
                console.error("[DbSync] Failed to create Table!", def, err);
            });
    }

    private createColumnFromDefinition(builder: TableBuilder, def: ResourceColumnDefinition) {
        let col: ColumnBuilder;

        switch (def.sqlType) {
            case "VARCHAR":
                col = builder.string(def.columnName, def.length || 255);
                break;
            case "INT":
                if (def.autoIncrement) col = builder.increments(def.columnName);
                else col = builder.integer(def.columnName);
                break;
            case "BIGINT":
                if (def.autoIncrement) col = builder.bigIncrements(def.columnName);
                else col = builder.bigInteger(def.columnName);
                break;
            case "TIMESTAMP":
                col = builder.timestamp(def.columnName);
                break;
            case "FLOAT":
                col = builder.float(def.columnName);
                break;
            case "JSON":
                col = builder.json(def.columnName);
                break;
            case "TEXT":
                col = builder.text(def.columnName);
                break;

            default:
                throw new Error("SQL Type was not properly handles by DatabaseSynchronizer, please check the code for managing " + def.sqlType + " SQL Types!");
        }

        if (def.default) col!.defaultTo(def.default);
        if (def.unique) col!.unique();
        if (def.primary) col!.primary();
        if (def.index) col!.index();
        if (def.nullable === false) col!.notNullable(); else col!.nullable();
        if (def.unsigned) col!.unsigned();

        if (def.references)
            col
                .references(def.references.columnName)
                .inTable(def.references.tableName)
                .onUpdate(def.references.onUpdate || "RESTRICT")
                .onDelete(def.references.onDelete || "RESTRICT");

        return col;
    }
}