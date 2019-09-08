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
const RowObject_1 = require("../structure/rowModel/RowObject");
const Table_1 = require("../structure/table/Table");
const QueryFilter_1 = require("../dataQuery/QueryFilter");
class ObjectRepository {
    constructor(system) {
        this.objects = [];
        this.system = system;
        this.objectTable = new Table_1.Table(system, "Auria.Object");
        //@todo load table info!
        this.objectTable.table = "object";
    }
    getObjectEquivalent(rowModel) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                let query = this.objectTable.newQuery();
                query.addFilters(false, new QueryFilter_1.QueryFilter().set("table", "=", rowModel.getTable().getName()), new QueryFilter_1.QueryFilter().set("table_id", "=", rowModel.getId()), new QueryFilter_1.QueryFilter().set("pk_field", "=", rowModel.getTable().distinctiveColumn));
                query.fetch()
                    .then((res) => {
                    switch (res.length) {
                        // # - No object found!
                        case 0:
                            let nObj = this.createObjectToRowModel(rowModel);
                            resolve(nObj);
                            break;
                        // # - Object found
                        case 1:
                            let obj = new RowObject_1.RowObject(rowModel, res[0]["_id"]);
                            obj.setInfo(res[0]);
                            resolve(obj);
                            break;
                        // # - Shouldn't be more than one object per row
                        default:
                            reject("[ObjectRepository] Failed to pinpoint object from row model! Length: " + res.length);
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
            return promise;
        });
    }
    createObjectToRowModel(rowModel) {
        let nObj = new RowObject_1.RowObject(rowModel);
        nObj.setInfo({
            active: 1,
            current_version: 1,
            lock_time: 0,
            lock_user: 0,
            next_version: 2,
            owner: 0,
            owner_role: 0,
            pk_field: rowModel.getTable().distinctiveColumn,
            table: rowModel.getTable().getName(),
            table_id: rowModel.getId(),
            created_at: Date.now(),
            updated_at: Date.now(),
            deleted_at: undefined
        });
        nObj.save();
        return nObj;
    }
}
exports.ObjectRepository = ObjectRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0UmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvb2JqZWN0L09iamVjdFJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLCtEQUE0RDtBQUM1RCxvREFBaUQ7QUFDakQsMERBQXVEO0FBRXZELE1BQWEsZ0JBQWdCO0lBTXpCLFlBQVksTUFBYztRQUV0QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksYUFBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBRXRDLENBQUM7SUFFWSxtQkFBbUIsQ0FBQyxRQUFrQjs7WUFFL0MsSUFBSSxPQUFPLEdBQXVCLElBQUksT0FBTyxDQUN6QyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFeEMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQ2xCLElBQUkseUJBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUNsRSxJQUFJLHlCQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDeEQsSUFBSSx5QkFBVyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQ2hGLENBQUM7Z0JBQ0YsS0FBSyxDQUFDLEtBQUssRUFBRTtxQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtvQkFDakIsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFO3dCQUNoQix1QkFBdUI7d0JBQ3ZCLEtBQUssQ0FBQzs0QkFDRixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDZCxNQUFNO3dCQUVWLG1CQUFtQjt3QkFDbkIsS0FBSyxDQUFDOzRCQUNGLElBQUksR0FBRyxHQUFHLElBQUkscUJBQVMsQ0FBQyxRQUFRLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ2hELEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDYixNQUFNO3dCQUNWLGdEQUFnRDt3QkFDaEQ7NEJBQ0ksTUFBTSxDQUFDLHVFQUF1RSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDcEc7Z0JBR0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQ2IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FDSixDQUFDO1lBQ0YsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztLQUFBO0lBRU0sc0JBQXNCLENBQUMsUUFBa0I7UUFFNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxxQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDVCxNQUFNLEVBQUUsQ0FBQztZQUNULGVBQWUsRUFBRSxDQUFDO1lBQ2xCLFNBQVMsRUFBRSxDQUFDO1lBQ1osU0FBUyxFQUFFLENBQUM7WUFDWixZQUFZLEVBQUUsQ0FBQztZQUNmLEtBQUssRUFBRSxDQUFDO1lBQ1IsVUFBVSxFQUFFLENBQUM7WUFDYixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQjtZQUMvQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNwQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRTtZQUMxQixVQUFVLEVBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUN2QixVQUFVLEVBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUN2QixVQUFVLEVBQUcsU0FBUztTQUN6QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBR0o7QUFuRkQsNENBbUZDIn0=