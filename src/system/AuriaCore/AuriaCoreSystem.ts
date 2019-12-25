import { System } from "../../kernel/System";
import { CoreAccessManager } from "./security/CoreAccessManager";
import { Module } from "../../kernel/module/Module";
import { AuriaArchitect } from "./module/architect/AuriaArchitect";
import { SystemAuthenticator } from "../../kernel/security/auth/SystemAuthenticator";
import { CoreAuthenticator } from "./security/CoreAuthenticator";
import Knex = require("knex");

export class AuriaCoreSystem extends System {

    protected accessManager: CoreAccessManager;

    protected authenticator : CoreAuthenticator;

    constructor() {
        super("AuriaCore");

        this.authenticator = new CoreAuthenticator(this);

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

    protected buildSystemConnection(): Knex {

        let coreConn = Knex({
            client : "mysql",
            connection : {
                server : "localhost",
                port : 3307,
                database : "auria",
                user : "root",
                password : ""
            }
        });

        return coreConn;
    }

    public getSystemConnection(): Knex {

        if(this.connection == undefined)
            this.connection = this.buildSystemConnection();

        return this.connection;
    }

    public getSystemAccessManager(): CoreAccessManager {

        if (this.accessManager == null) {
            this.accessManager = new CoreAccessManager(this);
        }

        return this.accessManager;
    }

    public getAuthenticator(): SystemAuthenticator {
        return this.authenticator;
    }

}