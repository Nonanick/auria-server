import { System } from "../../kernel/System";
import { CoreAccessManager } from "./security/CoreAccessManager";
import { Module } from "../../kernel/module/Module";
import { SystemAuthenticator } from "../../kernel/security/auth/SystemAuthenticator";
import { CoreAuthenticator } from "./security/CoreAuthenticator";
import Knex = require("knex");
export declare class AuriaCoreSystem extends System {
    protected accessManager: CoreAccessManager;
    protected authenticator: CoreAuthenticator;
    constructor();
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): Knex;
    getSystemConnection(): Knex;
    getSystemAccessManager(): CoreAccessManager;
    getAuthenticator(): SystemAuthenticator;
}
