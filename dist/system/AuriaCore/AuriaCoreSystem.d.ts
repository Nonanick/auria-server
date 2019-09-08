import { System } from "../../kernel/System";
import { CoreAccessManager } from "./security/CoreAccessManager";
import { AuriaServer } from "../../AuriaServer";
import { Module } from "../../kernel/module/Module";
import { MysqlConnection } from "../../kernel/database/connection/MysqlConnection";
export declare class AuriaCoreSystem extends System {
    protected accessManager: CoreAccessManager;
    constructor(server: AuriaServer);
    protected buildSystemModules(): Map<string, Module>;
    getSystemModules(): Map<string, Module>;
    protected buildSystemConnection(): MysqlConnection;
    getSystemConnection(): MysqlConnection;
    getSystemAccessManager(): CoreAccessManager;
}
