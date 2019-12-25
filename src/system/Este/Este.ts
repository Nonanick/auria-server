import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import { AccessManager } from "../../kernel/security/AccessManager";
import Knex = require("knex");

export class Este extends System {

    public getAuthenticator(): import("../../kernel/security/auth/SystemAuthenticator").SystemAuthenticator {
        throw new Error("Method not implemented.");
    }

    constructor() {
        super("Este");
    }

    protected buildSystemModules(): Map<string, Module> {
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


}