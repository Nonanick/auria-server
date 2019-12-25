import { System } from "../../System";
import { SystemAuthenticator } from "../../security/auth/SystemAuthenticator";
import { AccessManager } from "../../security/AccessManager";
import { Module } from "../../module/Module";
import Knex = require("knex");

export class AuriaSystem extends System {

    protected buildSystemModules(): Map<string,Module> {
        throw new Error("Method not implemented.");
    }    
    
    public getSystemModules(): Map<string, Module> {
        throw new Error("Method not implemented.");
    }
    
    protected buildSystemConnection(): Knex {
        throw new Error("Method not implemented.");
    }

    public getSystemConnection(): Knex {
        throw new Error("Method not implemented.");
    }

    public getSystemAccessManager(): AccessManager {
        throw new Error("Method not implemented.");
    }
    
    public getAuthenticator(): SystemAuthenticator {
        throw new Error("Method not implemented.");
    }


}