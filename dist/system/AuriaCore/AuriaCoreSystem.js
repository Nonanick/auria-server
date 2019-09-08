"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const System_1 = require("../../kernel/System");
const CoreAccessManager_1 = require("./security/CoreAccessManager");
const AuriaArchitect_1 = require("./module/architect/AuriaArchitect");
const MysqlConnection_1 = require("../../kernel/database/connection/MysqlConnection");
class AuriaCoreSystem extends System_1.System {
    constructor(server) {
        super(server, "AuriaCore");
        this.addModule(new AuriaArchitect_1.AuriaArchitect(this));
    }
    buildSystemModules() {
        throw new Error("Method not implemented.");
    }
    getSystemModules() {
        throw new Error("Method not implemented.");
    }
    buildSystemConnection() {
        let coreConn = new MysqlConnection_1.MysqlConnection('localhost', 3307, 'root', 'auria');
        coreConn.connectPool('');
        return coreConn;
    }
    getSystemConnection() {
        return this.connection;
    }
    getSystemAccessManager() {
        if (this.accessManager == null) {
            this.accessManager = new CoreAccessManager_1.CoreAccessManager(this);
        }
        return this.accessManager;
    }
}
exports.AuriaCoreSystem = AuriaCoreSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFDb3JlU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N5c3RlbS9BdXJpYUNvcmUvQXVyaWFDb3JlU3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQTZDO0FBQzdDLG9FQUFpRTtBQUdqRSxzRUFBbUU7QUFDbkUsc0ZBQW1GO0FBRW5GLE1BQWEsZUFBZ0IsU0FBUSxlQUFNO0lBSXZDLFlBQVksTUFBbUI7UUFDM0IsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsU0FBUyxDQUNWLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FDM0IsQ0FBQztJQUdOLENBQUM7SUFFUyxrQkFBa0I7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFUyxxQkFBcUI7UUFFM0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFdBQVcsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBFLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFekIsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVNLG1CQUFtQjtRQUN0QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLHNCQUFzQjtRQUV6QixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwRDtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDO0NBR0o7QUE3Q0QsMENBNkNDIn0=