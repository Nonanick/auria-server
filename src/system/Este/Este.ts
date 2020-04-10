import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import Knex = require("knex");

export class Este extends System {
    
    public getDataSteward(): import("aurialib2/data/steward/DataSteward").DataSteward {
        throw new Error("Method not implemented.");
    }
    
    protected getAccessRuleFactory(): import("../../kernel/security/access/AccessRuleFactory").AccessRuleFactory {
        throw new Error("Method not implemented.");
    }

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



}