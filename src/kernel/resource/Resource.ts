import { EventEmitter } from 'events';
import { System } from '../System.js';
import { ConnectionDefinition } from '../connection/Connection.js';
import { ResourceColumnDefinition, ResourceColumn } from './ResourceColumn.js';
import { ConnectionTableDefinition } from './systemSchema/connection/ConnectionResourceDefinition.js';
import { DefaultStatusColumnDefinition } from './systemSchema/defaultColumns/DefaultStatusColumnDefinition.js';

export class Resource extends EventEmitter {

    protected connectionInfoPromise: Promise<ConnectionDefinition>;
    protected connectionInfo: ConnectionDefinition;
    protected _connection: number | ConnectionDefinition;

    protected _name: string;

    protected id: number;

    public get name(): string {
        return this.name;
    }
    protected _title: string;

    protected _tableName: string;

    public get tableName(): string {
        return this._tableName;
    }

    protected _description: string;

    protected _columns: {
        [columnName: string]: ResourceColumn
    } = {};

    protected _uniqueKeys: {
        [keyName: string]: string[]
    } = {};


    public static fromDefinition(system: System, def: ResourceDefinition): Resource {

        let res = new Resource(system);

        return res;
    }


    private system: System;

    constructor(system: System) {
        super();

        this.system = system;

    }

    public getId(): number {
        return this.id;
    }

    public async setConnection(id: number): Promise<Resource>;
    public async setConnection(info: ConnectionDefinition): Promise<Resource>;
    public async setConnection(idOrInfo: number | ConnectionDefinition): Promise<Resource> {

        if (typeof idOrInfo === "number") {
            try {
                this.connectionInfo = await this.loadConnectionInfoFromDatabase(idOrInfo);
            } catch (err) {
                console.error("[Resource] Failed to load connection info form ID ", idOrInfo, " database returned an error!", err);
                delete this.connectionInfo;
            }
            return this;
        } else {
            this.connectionInfo = idOrInfo;
            return this;
        }

    }

    public async getConnectionInfo(): Promise<ConnectionDefinition> {
        return this.connectionInfoPromise;
    }

    private async loadConnectionInfoFromDatabase(id: number): Promise<ConnectionDefinition> {
        return this.connectionInfoPromise = this.system.getSystemConnection()
            .select(ConnectionTableDefinition.columns.ID)
            .from(ConnectionTableDefinition.tableName)
            .where(ConnectionTableDefinition.columns.ID.columnName, id)
            .where(DefaultStatusColumnDefinition.columnName)
            .then((connectionRows) => {
                if (connectionRows.length != 1) throw Error();

                let connInfo = connectionRows[0];

                let def: ConnectionDefinition = {
                    driver: connInfo.driver,
                    name: connInfo.name,
                    title: connInfo.title,
                    host: connInfo.host,
                    database: connInfo.database,
                    username: connInfo.username,
                    password: connInfo.password,
                    port: connInfo.port,
                };

                return def;
            });
    }
    public async getDefinition(): Promise<ResourceDefinition> {

        let columnsDef: {
            [columnName: string]: ResourceColumnDefinition
        } = {};

        for (var colName in this._columns) {
            if (this._columns.hasOwnProperty(colName)) {
                columnsDef[colName] = this._columns[colName].getDefinition();
            }
        }
        let def: ResourceDefinition = {
            connection: await this.getConnectionInfo(),
            name: this._name,
            title: this._title,
            tableName: this._tableName,
            description: this._description,
            columns: columnsDef
        };


        return def;
    }
}

export interface ResourceDefinition {

    connection: ConnectionDefinition;
    tableName: string;
    name: string;
    title: string;
    description: string;
    columns: { [columnName: string]: ResourceColumnDefinition },
    unique?: {
        [uniqueKeyName: string]: string | string[];
    },
    checkConstraints?: {
        [constraintName: string]: string
    }
}
/**
 * 
 * Typescript workaround
 * 
 * -- Prevents overriding of const properties with validation
 * 
 *      When providing a "validation" such as
 *          var const : {[keyName : string] : Object} = { Banana : object, Apple : object};
 *      The constant keys (Banana, Apple) will not be avaliable for autocompletion!
 * 
 * 
 * This function preserves "const" autocomplete but inherits ResourceDefinition 
 * type validation!
 * 
 * To define a new ResourceDefinition use  
 * 
 *     asResource({
 *          ... resource definition as usual
 *      });
 * 
 * The return will have its properties correctly validated by Typescript and the object keys
 * will be avaliable in Typescript Intelissense
 * 
 * @param arg ResourceDefinition 
 */
export function asResource<T extends ResourceDefinition>(arg: T): T {
    return arg;
}