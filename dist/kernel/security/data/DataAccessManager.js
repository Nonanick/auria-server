"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TableManager_1 = require("../../database/TableManager");
const SystemUser_1 = require("../SystemUser");
const QueryFilter_1 = require("../../database/dataQuery/QueryFilter");
const UpdateAction_1 = require("../../database/structure/table/actions/UpdateAction");
const CreateAction_1 = require("../../database/structure/table/actions/CreateAction");
const DeleteAction_1 = require("../../database/structure/table/actions/DeleteAction");
const LockAction_1 = require("../../database/structure/table/actions/LockAction");
const UnlockAction_1 = require("../../database/structure/table/actions/UnlockAction");
class DataAccessManager {
    constructor(system, dataPermissionTable) {
        this.tableManager = new TableManager_1.TableManager(system);
        this.system = system;
        this.permissionTable = dataPermissionTable;
    }
    getTable(user, table) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userHasAccessToTable(user, table)) {
                return this.tableManager.getTable(table);
            }
            else {
                throw new Error("[Unauthorized] User can't reach requested table!");
            }
        });
    }
    select(user, tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            let selPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.userHasAccessToTable(user, tableName)) {
                    let table = yield this.tableManager.getTable(tableName);
                    let query = table.newQuery();
                    query.addFilters(true, new QueryFilter_1.QueryFilter());
                    resolve(query);
                }
                else {
                    reject("[DataAccessManager] User does not have access to table, can't read!");
                }
            }));
            return selPromise;
        });
    }
    update(user, table, rowModels) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UpdateAction_1.UpdateAction(table);
        });
    }
    insert(user, table, rowModels) {
        return __awaiter(this, void 0, void 0, function* () {
            return new CreateAction_1.CreateAction(table);
        });
    }
    delete(user, table, rowModels) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DeleteAction_1.DeleteAction(table);
        });
    }
    lock(user, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return new LockAction_1.LockAction(table);
        });
    }
    unlock(user, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UnlockAction_1.UnlockAction(table);
        });
    }
    userHasAccessToTable(user, table) {
        if (user.getAccessLevel() == SystemUser_1.SystemUserPrivilege.MASTER) {
            return true;
        }
        else {
            this.permissionTable.newQuery().addFilters(false, new QueryFilter_1.QueryFilter().set("user_id", "=", user.getUsername()));
            return false;
        }
    }
    listAllTables(by) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tableManager.getTables()
                .then(tables => {
                let ret = [];
                tables.forEach((t) => {
                    ret.push(by == "name" ? t.getName() : t.table);
                });
                return ret;
            });
        });
    }
}
exports.DataAccessManager = DataAccessManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YUFjY2Vzc01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL3NlY3VyaXR5L2RhdGEvRGF0YUFjY2Vzc01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDhEQUEyRDtBQUUzRCw4Q0FBZ0U7QUFFaEUsc0VBQW1FO0FBRW5FLHNGQUFtRjtBQUNuRixzRkFBbUY7QUFDbkYsc0ZBQW1GO0FBQ25GLGtGQUErRTtBQUMvRSxzRkFBbUY7QUFHbkYsTUFBYSxpQkFBaUI7SUF5QjFCLFlBQVksTUFBYyxFQUFFLG1CQUEwQjtRQUVsRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsZUFBZSxHQUFHLG1CQUFtQixDQUFBO0lBQzlDLENBQUM7SUFFWSxRQUFRLENBQUMsSUFBZ0IsRUFBRSxLQUFhOztZQUVqRCxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3hDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUM7aUJBQU07Z0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO2FBQ3ZFO1FBQ0wsQ0FBQztLQUFBO0lBRVksTUFBTSxDQUFDLElBQWdCLEVBQUUsU0FBaUI7O1lBQ25ELElBQUksVUFBVSxHQUFHLElBQUksT0FBTyxDQUN4QixDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO29CQUM1QyxJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUkseUJBQVcsRUFBRSxDQUFDLENBQUE7b0JBRXpDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFFbEI7cUJBQU07b0JBQ0gsTUFBTSxDQUFDLHFFQUFxRSxDQUFDLENBQUM7aUJBQ2pGO1lBQ0wsQ0FBQyxDQUFBLENBQ0osQ0FBQztZQUVGLE9BQU8sVUFBVSxDQUFDO1FBQ3RCLENBQUM7S0FBQTtJQUVZLE1BQU0sQ0FBQyxJQUFnQixFQUFFLEtBQVksRUFBRSxTQUFxQjs7WUFDckUsT0FBTyxJQUFJLDJCQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQztLQUFBO0lBRVksTUFBTSxDQUFDLElBQWdCLEVBQUUsS0FBWSxFQUFFLFNBQXFCOztZQUNyRSxPQUFPLElBQUksMkJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDO0tBQUE7SUFFWSxNQUFNLENBQUMsSUFBZ0IsRUFBRSxLQUFZLEVBQUUsU0FBcUI7O1lBQ3JFLE9BQU8sSUFBSSwyQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FBQTtJQUVZLElBQUksQ0FBQyxJQUFnQixFQUFFLEtBQVk7O1lBQzVDLE9BQU8sSUFBSSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUM7S0FBQTtJQUVZLE1BQU0sQ0FBQyxJQUFnQixFQUFFLEtBQVk7O1lBQzlDLE9BQU8sSUFBSSwyQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FBQTtJQUVTLG9CQUFvQixDQUFDLElBQWdCLEVBQUUsS0FBYTtRQUMxRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxnQ0FBbUIsQ0FBQyxNQUFNLEVBQUU7WUFDckQsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUM1QyxJQUFJLHlCQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FDNUQsQ0FBQztZQUNGLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVZLGFBQWEsQ0FBQyxFQUFvQjs7WUFDM0MsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtpQkFDL0IsSUFBSSxDQUNELE1BQU0sQ0FBQyxFQUFFO2dCQUNMLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztnQkFFdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNqQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FDSixDQUFDO1FBQ1YsQ0FBQztLQUFBO0NBQ0o7QUEzR0QsOENBMkdDIn0=