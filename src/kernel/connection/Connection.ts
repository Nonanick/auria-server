import { EventEmitter } from 'events';
import { System } from '../System';

export class Connection extends EventEmitter {


    public name: string;
    public title?: string;
    public driver: string;
    public database: string;
    public username: string;
    public port: number;
    public password: string;
    public host: string;
   // private system: System;

    constructor(system: System) {
        super();

        //this.system = system;
    }

    public getDefinition(): ConnectionDefinition {
        
        let def: ConnectionDefinition = {
            name: this.name,
            title: this.title,
            driver: this.driver,
            database: this.database,
            username: this.username,
            port: this.port,
            password: this.password,
            host: this.host,
        };

        return def;
    }
}

export interface ConnectionDefinition {
    name: string;
    title?: string;
    driver: string;
    database: string;
    username: string;
    port: number;
    password: string;
    host: string;

}