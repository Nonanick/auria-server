"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AccessManager_1 = require("../../../kernel/security/AccessManager");
const SystemUser_1 = require("../../../kernel/security/SystemUser");
class CoreAccessManager extends AccessManager_1.AccessManager {
    validateUser(user) {
        return user.getAccessLevel() >= SystemUser_1.SystemUserPrivilege.MASTER;
    }
    canAccessRequest(request) {
        // # - User >= Sys_Admin can access ALL Modules
        if (this.listener.name == "LoginListener") {
            return true;
        }
        else {
            return true; //this.validateUser(this.user);
        }
    }
    getUserAccessTree() {
        let tree = {
            modules: []
        };
        let mod = this.system.getAllModules();
        mod.forEach((module, moduleInd) => {
            tree.modules.push({
                module: module.name,
                listeners: '*'
            });
        });
        return tree;
    }
    getListenerAction() {
        return this.action;
    }
}
exports.CoreAccessManager = CoreAccessManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZUFjY2Vzc01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9zZWN1cml0eS9Db3JlQWNjZXNzTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBFQUF1RTtBQUN2RSxvRUFBc0Y7QUFLdEYsTUFBYSxpQkFBa0IsU0FBUSw2QkFBYTtJQUV6QyxZQUFZLENBQUMsSUFBZ0I7UUFDaEMsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksZ0NBQW1CLENBQUMsTUFBTSxDQUFDO0lBQy9ELENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFxQjtRQUN6QywrQ0FBK0M7UUFDL0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxlQUFlLEVBQUU7WUFDdkMsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsQ0FBQSwrQkFBK0I7U0FDOUM7SUFDTCxDQUFDO0lBRU0saUJBQWlCO1FBRXBCLElBQUksSUFBSSxHQUFtQjtZQUN2QixPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUM7UUFFRixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXRDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNuQixTQUFTLEVBQUUsR0FBRzthQUNqQixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxpQkFBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7Q0FFSjtBQXJDRCw4Q0FxQ0MifQ==