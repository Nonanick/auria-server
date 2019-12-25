"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const System_1 = require("../../kernel/System");
const CoreAccessManager_1 = require("./security/CoreAccessManager");
const AuriaArchitect_1 = require("./module/architect/AuriaArchitect");
const CoreAuthenticator_1 = require("./security/CoreAuthenticator");
const Knex = require("knex");
class AuriaCoreSystem extends System_1.System {
    constructor() {
        super("AuriaCore");
        this.authenticator = new CoreAuthenticator_1.CoreAuthenticator(this);
        this.addModule(new AuriaArchitect_1.AuriaArchitect(this));
    }
    buildSystemModules() {
        throw new Error("Method not implemented.");
    }
    getSystemModules() {
        throw new Error("Method not implemented.");
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
    getSystemAccessManager() {
        if (this.accessManager == null) {
            this.accessManager = new CoreAccessManager_1.CoreAccessManager(this);
        }
        return this.accessManager;
    }
    getAuthenticator() {
        return this.authenticator;
    }
}
exports.AuriaCoreSystem = AuriaCoreSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFDb3JlU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N5c3RlbS9BdXJpYUNvcmUvQXVyaWFDb3JlU3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQTZDO0FBQzdDLG9FQUFpRTtBQUVqRSxzRUFBbUU7QUFFbkUsb0VBQWlFO0FBQ2pFLDZCQUE4QjtBQUU5QixNQUFhLGVBQWdCLFNBQVEsZUFBTTtJQU12QztRQUNJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVuQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUNBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLFNBQVMsQ0FDVixJQUFJLCtCQUFjLENBQUMsSUFBSSxDQUFDLENBQzNCLENBQUM7SUFFTixDQUFDO0lBRVMsa0JBQWtCO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sZ0JBQWdCO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRVMscUJBQXFCO1FBRTNCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztZQUNoQixNQUFNLEVBQUcsT0FBTztZQUNoQixVQUFVLEVBQUc7Z0JBQ1QsTUFBTSxFQUFHLFdBQVc7Z0JBQ3BCLElBQUksRUFBRyxJQUFJO2dCQUNYLFFBQVEsRUFBRyxPQUFPO2dCQUNsQixJQUFJLEVBQUcsTUFBTTtnQkFDYixRQUFRLEVBQUcsRUFBRTthQUNoQjtTQUNKLENBQUMsQ0FBQztRQUVILE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxtQkFBbUI7UUFFdEIsSUFBRyxJQUFJLENBQUMsVUFBVSxJQUFJLFNBQVM7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUVuRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLHNCQUFzQjtRQUV6QixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwRDtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDO0lBRU0sZ0JBQWdCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDO0NBRUo7QUE5REQsMENBOERDIn0=