import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import Knex = require("knex");
export declare class Este extends System {
    protected getAccessRuleFactory(): import("../../kernel/security/access/AccessRuleFactory").AccessRuleFactory;
    getAuthenticator(): import("../../kernel/security/auth/SystemAuthenticator").SystemAuthenticator;
    constructor();
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): Knex;
    getSystemConnection(): Knex;
}
