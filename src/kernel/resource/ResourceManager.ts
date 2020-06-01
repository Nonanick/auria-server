import { EventEmitter } from 'events';
import { System } from '../System.js';
import { Bootable } from 'aurialib2';
import { DatabaseSynchronizer } from './databaseSync/DatabaseSynchronizer.js';
import { ConnectionDefinition } from '../connection/Connection.js';
import { Resource } from './Resource.js';
import { SystemSchema } from './systemSchema/SystemSchema.js';
import { ResourceNotFound } from '../exceptions/kernel/resource/ResourceNotFound.js';
import { Auria_ENV } from '../../AuriaServer.js';
import { SystemConnectionDefinition } from '../connection/SystemConnectionDefinition.js';

export class ResourceManager extends EventEmitter implements Bootable {

    private _system: System;

    private synchronizers: Map<string, DatabaseSynchronizer>;

    private resources: Map<string, Resource>;

    private resourcesById: Resource[];

    private systemSchema: typeof SystemSchema;

    constructor(system: System) {
        super();

        this._system = system;
        this.synchronizers = new Map();
        this.resources = new Map();
    }

    public getConnectionSynchronizer(connDef: ConnectionDefinition): DatabaseSynchronizer {

        if (!this.synchronizers.has(connDef.name)) {
            this.synchronizers.set(connDef.name, this.buildDatabaseSynchronizer(connDef));
        }

        return this.synchronizers.get(connDef.name)!;
    }

    private buildDatabaseSynchronizer(connDef: ConnectionDefinition) {
        let sync = new DatabaseSynchronizer(this._system, connDef);

        return sync;
    }

    public getResourceByName(name: string): Resource {
        if (this.resources.has(name)) {
            return this.resources.get(name)!;
        } else {
            throw new ResourceNotFound("[ResourceManager] Resource with the name '" + name + "' was not found in this system!\n" +
                "List of avaliable resources:" + Array.from(this.resources.keys()).join(", "));
        }
    }

    public getResourceById(id: number): Resource {
        if (this.resourcesById[id] != null) {
            return this.resources[id]!;
        } else {
            throw new ResourceNotFound("[ResourceManager] Resource with the ID '" + id + "' was not found in this system!\n" +
                "List of avaliable resources:" + this.resourcesById.map((v, i) => "[" + i + "] - " + v.name).join(", "));
        }
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {
        return async () => {

            if (Auria_ENV == "development") {
                await this.bootDevSystemSchema();
            }


            return true;
        };
    }

    /**
     * Will apply system schema in the current system databae
     */
    private async bootDevSystemSchema() {
        this.systemSchema = SystemSchema;

        //System Connection Definition
        let connDef = SystemConnectionDefinition;

        let sync = this.getConnectionSynchronizer(connDef);

        for (var resourceName in this.systemSchema) {
            if (this.systemSchema.hasOwnProperty(resourceName)) {
                let resDef = this.systemSchema[resourceName];
                let result = await sync.compareResourceDefinitionWithDatabase(resDef);

                if (result.status == "NOT_IN_DB") {
                    try {
                        await sync.createTableFromDefinition(resDef);
                    } catch (err) {
                        console.error("[ResourceManager] Failed to create table! ", err);
                    }
                }
            }
        }
    }
}