import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import { MysqlConnection } from "../../kernel/database/connection/MysqlConnection";
import { AccessManager } from "../../kernel/security/AccessManager";
import { AuriaServer } from "../../AuriaServer";
export declare class Este extends System {
    constructor(server: AuriaServer);
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): MysqlConnection;
    getSystemConnection(): MysqlConnection;
    getSystemAccessManager(): AccessManager;
}
