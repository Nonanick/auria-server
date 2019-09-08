import { System } from "../../kernel/System";
import { CoreAccessManager } from "./security/CoreAccessManager";
import { AuriaServer } from "../../AuriaServer";
import { Module } from "../../kernel/module/Module";
import { AuriaArchitect } from "./module/architect/AuriaArchitect";
import { MysqlConnection } from "../../kernel/database/connection/MysqlConnection";

export class AuriaCoreSystem extends System {

    protected accessManager: CoreAccessManager;

    constructor(server: AuriaServer) {
        super(server, "AuriaCore");

        this.addModule(
            new AuriaArchitect(this)
        );

        
    }

    protected buildSystemModules(): Map<string, Module> {
        throw new Error("Method not implemented.");
    }

    public getSystemModules(): Map<string, Module> {
        throw new Error("Method not implemented.");
    }

    protected buildSystemConnection(): MysqlConnection {

        let coreConn = new MysqlConnection('localhost',3307,'root','auria');

        coreConn.connectPool('');

        return coreConn;
    }

    public getSystemConnection(): MysqlConnection {
        return this.connection;
    }

    public getSystemAccessManager(): CoreAccessManager {

        if (this.accessManager == null) {
            this.accessManager = new CoreAccessManager(this);
        }

        return this.accessManager;
    }


}