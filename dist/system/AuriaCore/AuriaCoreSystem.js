"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaArchitect_1 = require("./module/architect/AuriaArchitect");
const CoreAuthenticator_1 = require("./security/CoreAuthenticator");
const Knex = require("knex");
const AuriaAccessRuleFactory_1 = require("../../default/security/access/AuriaAccessRuleFactory");
const AuriaSystem_1 = require("../../default/AuriaSystem");
class AuriaCoreSystem extends AuriaSystem_1.AuriaSystem {
    constructor() {
        super("AuriaCore");
        this.authenticator = new CoreAuthenticator_1.CoreAuthenticator(this);
        let ape = new AuriaAccessRuleFactory_1.AuriaAccessRuleFactory(this);
        this.accessPolicyEnforcer.setAccessRuleFactory(ape.getFactoryFunction());
        this.addModule(new AuriaArchitect_1.AuriaArchitect(this));
    }
    buildSystemConnection() {
        let coreConn = Knex({
            client: "mysql",
            connection: {
                server: "localhost",
                port: 3307,
                database: "auria",
                user: "root",
                password: ""
            }
        });
        return coreConn;
    }
    getSystemConnection() {
        if (this.connection == undefined)
            this.connection = this.buildSystemConnection();
        return this.connection;
    }
    getAuthenticator() {
        return this.authenticator;
    }
}
exports.AuriaCoreSystem = AuriaCoreSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFDb3JlU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N5c3RlbS9BdXJpYUNvcmUvQXVyaWFDb3JlU3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0VBQW1FO0FBQ25FLG9FQUFpRTtBQUNqRSw2QkFBOEI7QUFDOUIsaUdBQThGO0FBQzlGLDJEQUF3RDtBQUd4RCxNQUFhLGVBQWdCLFNBQVEseUJBQVc7SUFJNUM7UUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHFDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpELElBQUksR0FBRyxHQUFHLElBQUksK0NBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFFekUsSUFBSSxDQUFDLFNBQVMsQ0FDVixJQUFJLCtCQUFjLENBQUMsSUFBSSxDQUFDLENBQzNCLENBQUM7SUFFTixDQUFDO0lBRVMscUJBQXFCO1FBRTNCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztZQUNoQixNQUFNLEVBQUcsT0FBTztZQUNoQixVQUFVLEVBQUc7Z0JBQ1QsTUFBTSxFQUFHLFdBQVc7Z0JBQ3BCLElBQUksRUFBRyxJQUFJO2dCQUNYLFFBQVEsRUFBRyxPQUFPO2dCQUNsQixJQUFJLEVBQUcsTUFBTTtnQkFDYixRQUFRLEVBQUcsRUFBRTthQUNoQjtTQUNKLENBQUMsQ0FBQztRQUVILE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxtQkFBbUI7UUFFdEIsSUFBRyxJQUFJLENBQUMsVUFBVSxJQUFJLFNBQVM7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUVuRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUdNLGdCQUFnQjtRQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztDQUVKO0FBL0NELDBDQStDQyJ9