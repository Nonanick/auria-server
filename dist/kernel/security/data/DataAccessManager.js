"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YUFjY2Vzc01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL3NlY3VyaXR5L2RhdGEvRGF0YUFjY2Vzc01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw4REFBMkQ7QUFFM0QsOENBQWdFO0FBRWhFLHNFQUFtRTtBQUVuRSxzRkFBbUY7QUFDbkYsc0ZBQW1GO0FBQ25GLHNGQUFtRjtBQUNuRixrRkFBK0U7QUFDL0Usc0ZBQW1GO0FBR25GLE1BQWEsaUJBQWlCO0lBeUIxQixZQUFZLE1BQWMsRUFBRSxtQkFBMEI7UUFFbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLDJCQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQTtJQUM5QyxDQUFDO0lBRVksUUFBUSxDQUFDLElBQWdCLEVBQUUsS0FBYTs7WUFFakQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUN4QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVDO2lCQUFNO2dCQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQzthQUN2RTtRQUNMLENBQUM7S0FBQTtJQUVZLE1BQU0sQ0FBQyxJQUFnQixFQUFFLFNBQWlCOztZQUNuRCxJQUFJLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FDeEIsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3RCLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTtvQkFDNUMsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM3QixLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLHlCQUFXLEVBQUUsQ0FBQyxDQUFBO29CQUV6QyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBRWxCO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO2lCQUNqRjtZQUNMLENBQUMsQ0FBQSxDQUNKLENBQUM7WUFFRixPQUFPLFVBQVUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFWSxNQUFNLENBQUMsSUFBZ0IsRUFBRSxLQUFZLEVBQUUsU0FBcUI7O1lBQ3JFLE9BQU8sSUFBSSwyQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FBQTtJQUVZLE1BQU0sQ0FBQyxJQUFnQixFQUFFLEtBQVksRUFBRSxTQUFxQjs7WUFDckUsT0FBTyxJQUFJLDJCQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQztLQUFBO0lBRVksTUFBTSxDQUFDLElBQWdCLEVBQUUsS0FBWSxFQUFFLFNBQXFCOztZQUNyRSxPQUFPLElBQUksMkJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsSUFBZ0IsRUFBRSxLQUFZOztZQUM1QyxPQUFPLElBQUksdUJBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDO0tBQUE7SUFFWSxNQUFNLENBQUMsSUFBZ0IsRUFBRSxLQUFZOztZQUM5QyxPQUFPLElBQUksMkJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxDQUFDO0tBQUE7SUFFUyxvQkFBb0IsQ0FBQyxJQUFnQixFQUFFLEtBQWE7UUFDMUQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksZ0NBQW1CLENBQUMsTUFBTSxFQUFFO1lBQ3JELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7YUFBTTtZQUNILElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFDNUMsSUFBSSx5QkFBVyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQzVELENBQUM7WUFDRixPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFFWSxhQUFhLENBQUMsRUFBb0I7O1lBQzNDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7aUJBQy9CLElBQUksQ0FDRCxNQUFNLENBQUMsRUFBRTtnQkFDTCxJQUFJLEdBQUcsR0FBYSxFQUFFLENBQUM7Z0JBRXZCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDakIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxHQUFHLENBQUM7WUFDZixDQUFDLENBQ0osQ0FBQztRQUNWLENBQUM7S0FBQTtDQUNKO0FBM0dELDhDQTJHQyJ9