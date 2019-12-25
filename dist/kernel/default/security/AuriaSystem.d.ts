import { System } from "../../System";
import { SystemAuthenticator } from "../../security/auth/SystemAuthenticator";
import { AccessManager } from "../../security/AccessManager";
import { Module } from "../../module/Module";
import Knex = require("knex");
export declare class AuriaSystem extends System {
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): Knex;
    getSystemConnection(): Knex;
    getSystemAccessManager(): AccessManager;
    getAuthenticator(): SystemAuthenticator;
}
