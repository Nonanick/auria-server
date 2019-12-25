import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import { AccessManager } from "../../kernel/security/AccessManager";
import Knex = require("knex");
export declare class Este extends System {
    getAuthenticator(): import("../../kernel/security/auth/SystemAuthenticator").SystemAuthenticator;
    constructor();
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): Knex;
    getSystemConnection(): Knex;
    getSystemAccessManager(): AccessManager;
}
