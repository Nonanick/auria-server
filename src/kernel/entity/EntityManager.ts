import { EntityManager as EntityManagerLib } from 'aurialib2';
import { System } from '../System';
import { SystemEntity } from './SystemEntity';
import Knex from 'knex';
import { Connection } from './systemEntities/connection/Connection';
import { Table } from './systemEntities/table/Table';
import { Column } from './systemEntities/column/Column';
import { Module } from './systemEntities/module/Module';

export class EntityManager extends EntityManagerLib {

    public static EVENT_SYSTEM_CONNECTION_SET = "systemConnectionSet";

    protected system: System;

    protected isSystemConnectionSet : boolean = false;

    protected systemConnection : Knex;

    protected tables : Map<string, SystemEntity>;

    constructor(system: System) {
        super();
        this.on(EntityManager.EVENT_SYSTEM_CONNECTION_SET, ()=> {
            this.isSystemConnectionSet = true;
        });

        this.system = system;

        this.addEntities(
            new Connection(),
            new Table(),
            new Column(),
            new Module()
        );
    }

    public setSystemConnection(connection : Knex) {
        this.systemConnection = connection;
        this.emit(EntityManager.EVENT_SYSTEM_CONNECTION_SET, connection);
        return this;
    }

    public addEntity(entity: SystemEntity, name?: string) {
        super.addEntity(entity, name);
        return this;
    }

    public addEntities(...tables: SystemEntity[]) {
        for (let a = 0; a < tables.length; a++) {
            this.addEntity(tables[a]);
        }
    }

    public removeEntity(table: string | SystemEntity): SystemEntity | null {
        return super.removeEntity(table) as SystemEntity;
    }

    public getEntity(entity : string) : SystemEntity {
        return super.getEntity(entity) as SystemEntity;
    }

    public installSchema() {
        this.tables.forEach((table) => {
            table.installSchema(this.systemConnection);
        });
    }

}