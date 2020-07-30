import Knex from "knex";
import { AuriaSystemAuthenticator } from "../default/security/AuriaSystemAutheticator.js";
import { AuriaAccessRuleFactory } from "../default/security/access/AuriaAccessRuleFactory.js";
import { AccessRuleFactory } from "../kernel/security/access/AccessRuleFactory.js";
import { AuriaSystem } from "../default/AuriaSystem.js";
import { ResourceModule } from "./modules/resource/ResourceModule.js";
import { ResourceManager } from "../kernel/resource/ResourceManager.js";
import { SystemRequest } from "../kernel/http/request/SystemRequest.js";

export class ArchitectSystem extends AuriaSystem {

    protected systemConnection: Knex;

    protected authenticator: AuriaSystemAuthenticator;

    protected accessFactory: AuriaAccessRuleFactory;

    constructor() {
        super("Architect");

        this.addModule(
            new ResourceModule(this)
        );
        
    }

    protected buildSystemConnection(): import("knex") <any, unknown[]> {
        return Knex({
            client: 'mysql',
            connection: {
                host: 'localhost',
                database: 'auria',
                user: 'root',
                password: '',
                port: 3306,
                driver: 'mysql'
            }
        });
    }

    public getSystemConnection(): import("knex") <any, unknown[]> {
        if (this.systemConnection == null)
            this.systemConnection = this.buildSystemConnection();

        return this.systemConnection;
    }

    public getAuthenticator(): AuriaSystemAuthenticator {

        if (this.authenticator == null) {
            this.authenticator = new AuriaSystemAuthenticator(this);
        }

        return this.authenticator;
    }

    protected getAccessRuleFactory(): AccessRuleFactory {
        if (this.accessFactory == null)
            this.accessFactory = new AuriaAccessRuleFactory(this);

        return this.accessFactory.getFactoryFunction();
    }

    public async handleRequest(req: SystemRequest) {
        return super.handleRequest(req);
    }

    public getResourceManager(): ResourceManager {
        return this.resourceManager;
    }
}