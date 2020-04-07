import { AuriaArchitect } from "./module/architect/AuriaArchitect";
import { CoreAuthenticator } from "./security/CoreAuthenticator";
import Knex = require("knex");
import { AuriaAccessRuleFactory } from "../../default/security/access/AuriaAccessRuleFactory";
import { AuriaSystem } from "../../default/AuriaSystem";
import { PasswordAutheticator } from "../../kernel/security/auth/PasswordAuthenticator";

export class AuriaCoreSystem extends AuriaSystem {

    protected authenticator : CoreAuthenticator;

    constructor() {
        super("AuriaCore");

        this.authenticator = new CoreAuthenticator(this);

        let ape = new AuriaAccessRuleFactory(this);
        this.accessPolicyEnforcer.setAccessRuleFactory(ape.getFactoryFunction());

        this.addModule(
            new AuriaArchitect(this)
        );

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


    public getAuthenticator(): PasswordAutheticator {
        return this.authenticator;
    }

}