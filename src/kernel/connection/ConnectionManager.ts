import { EventEmitter } from 'events';
import Knex from 'knex';
import { ConnectionDefinition } from './Connection.js';
import { System } from '../System.js';
import { ConnectionTableDefinition } from '../resource/systemSchema/connection/ConnectionResourceDefinition.js';
import { DefaultIdColumnDefinition } from '../resource/systemSchema/defaultColumns/DefaultIdColumnDefinition.js';
import { ConnectionNotFound } from '../exceptions/kernel/connection/ConnectionNotFound.js';
import { Bootable } from 'aurialib2';
import { SystemConnectionDefinition } from './SystemConnectionDefinition.js';

export class ConnectionManager extends EventEmitter implements Bootable {

    private connections: Map<string, Knex>;

    private connectionsDef: Map<string, ConnectionDefinition>;

    private connectionsById: Knex[];

    private _system: System;

    constructor(system: System) {
        super();
        this._system = system;
        this.connections = new Map();
        this.connectionsDef = new Map();
        this.connectionsById = [];
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {
        return () => {
            let systemConn = SystemConnectionDefinition;

            this.connectionsDef.set(systemConn.name, systemConn);
            this.connections.set(systemConn.name, this._system.getSystemConnection());

            return true;
        };
    }

    /** 
     * Add Connection
     * ---------------
     * Add a connection definition to ConnectionManager
     * Will also create a Knex connection based on the definition passed!
     */
    public addConnection(connName: string, connDef: ConnectionDefinition): Knex {
        if (this.connections.has(connName)) {
            throw new Error("[ConnectionManager] Overidding an existing connection is not possible!\n Dupped name '" + connName + "'");
        }
        let conn = this.createKnexFromDefinition(connDef)
        this.connections.set(connName, conn);
        this.connectionsDef.set(connName, connDef);

        return conn;
    }

    /**
     * Create Knex From Connection Definition
     * ---------------------------------------
     * 
     * Giving an object that implements *ConnectionDefinition* shall attempt to create
     * a Knex connection object, since the actual connection is created only once the first queries
     * is called connection information is NOT verified!
     * 
     * @param connDefinition 
     */
    private createKnexFromDefinition(connDefinition: ConnectionDefinition): Knex {

        let connObj = Knex({
            client: connDefinition.driver,
            connection: {
                server: connDefinition.host,
                user: connDefinition.username,
                port: connDefinition.port,
                database: connDefinition.database,
                password: connDefinition.password,
            }
        });

        return connObj;
    }

    /**
     * Load Connection From ID
     * -----------------------
     * 
     * Will search in "Auria_Connection" table for a row with the given id
     * If found the function shall load and return a Knex object corresponding
     * to the connection information of that row
     * 
     * @param id number Connection Row ID
     */
    public async loadConnectionFromId(id: number): Promise<Knex> {

        if (this.connectionsById[id] != null)
            return this.connectionsById[id];

        return this._system.getSystemConnection()
            .select("*")
            .from(ConnectionTableDefinition.tableName)
            .where(DefaultIdColumnDefinition.columnName, id)
            .then((connectionsReturned) => {

                if (connectionsReturned.length != 1)
                    throw new ConnectionNotFound("[ConnectionManager] Failed to find Connection with id: " + id);

                let connRow = connectionsReturned[0];
                let definition: ConnectionDefinition =
                {
                    name: connRow.name,
                    database: connRow.database,
                    driver: connRow.driver,
                    host: connRow.host,
                    password: connRow.password,
                    username: connRow.username,
                    port: connRow.port,
                    title: connRow.title
                };

                let knexObj = this.addConnection(definition.name, definition);
                this.connectionsById[id] = knexObj;
                return knexObj;
            });

    }

    /**
     * Get Connection
     * ---------------
     * Will check if a connection with the given name was set and return it
     * 
     * Try to retrieve a Knex object by its connection name
     * @param connName 
     */
    public getConnection(connName: string): Knex {
        if (this.connections.has(connName)) {
            return this.connections.get(connName)!;
        } else {
            throw new ConnectionNotFound("[ConnectionManager] Connection named '" + connName + "' does NOT exists, yet(?)!");
        }
    }

    /**
     * Get Connection Definition
     * --------------------------
     * Will check if a connection definition with the given name was set and return it
     * 
     * Try to retrieve a ConnectionDefinition by its name
     * 
     * @param connName 
     */
    public getConnectionDefinition(connName: string): ConnectionDefinition {
        if (this.connectionsDef.has(connName)) {
            return this.connectionsDef.get(connName)!;
        } else {
            throw new ConnectionNotFound("[ConnectionManager] Connection Definition named '" + connName + "' does NOT exists, yet(?)!");
        }
    }

    /**
     * Add Knex Object
     * ----------------
     * 
     * Add a Knex object directly to the ConnectionManager without a ConnectionDefinition
     * 
     * @param connName 
     * @param knexObj 
     */
    public addKnexObject(connName: string, knexObj: Knex) {
        if (this.connections.has(connName)) {
            throw new Error("[ConnectionManager] Overidding an existing connection is not possible!\n Dupped name '" + connName + "'");
        }
        this.connections.set(connName, knexObj);
    }
}