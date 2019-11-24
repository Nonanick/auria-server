import { System } from "../../kernel/System";
import { Module } from "../../kernel/module/Module";
import { MysqlConnection } from "../../kernel/database/connection/MysqlConnection";
import { AccessManager } from "../../kernel/security/AccessManager";
import { AuriaServer } from "../../AuriaServer";

export class Este extends System {

    constructor(server : AuriaServer) {
        super(server, "Este");
    }

    protected buildSystemModules(): Map<string, Module> {
        throw new Error("Method not implemented.");
    }    
    
    public getSystemModules(): Map<string, Module> {
        throw new Error("Method not implemented.");
    }
    
    protected buildSystemConnection(): MysqlConnection {
        throw new Error("Method not implemented.");
    }

    public getSystemConnection(): MysqlConnection {
        throw new Error("Method not implemented.");
    }

    public getSystemAccessManager(): AccessManager {
        throw new Error("Method not implemented.");
    }


}