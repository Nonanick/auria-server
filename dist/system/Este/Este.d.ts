import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import Knex = require("knex");
export declare class Este extends System {
    getDataSteward(): import("aurialib2/data/steward/DataSteward").DataSteward;
    protected getAccessRuleFactory(): import("../../kernel/security/access/AccessRuleFactory").AccessRuleFactory;
    getAuthenticator(): import("../../kernel/security/auth/SystemAuthenticator").SystemAuthenticator;
    constructor();
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): Knex;
    getSystemConnection(): Knex;
}
