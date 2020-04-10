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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0UmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvb2JqZWN0L09iamVjdFJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSwrREFBNEQ7QUFDNUQsb0RBQWlEO0FBQ2pELDBEQUF1RDtBQUV2RCxNQUFhLGdCQUFnQjtJQU16QixZQUFZLE1BQWM7UUFFdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGFBQUssQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckQsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUV0QyxDQUFDO0lBRVksbUJBQW1CLENBQUMsUUFBa0I7O1lBRS9DLElBQUksT0FBTyxHQUF1QixJQUFJLE9BQU8sQ0FDekMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRXhDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUNsQixJQUFJLHlCQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsRUFDbEUsSUFBSSx5QkFBVyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQ3hELElBQUkseUJBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUNoRixDQUFDO2dCQUNGLEtBQUssQ0FBQyxLQUFLLEVBQUU7cUJBQ1osSUFBSSxDQUFDLENBQUMsR0FBVSxFQUFFLEVBQUU7b0JBQ2pCLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRTt3QkFDaEIsdUJBQXVCO3dCQUN2QixLQUFLLENBQUM7NEJBQ0YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2QsTUFBTTt3QkFFVixtQkFBbUI7d0JBQ25CLEtBQUssQ0FBQzs0QkFDRixJQUFJLEdBQUcsR0FBRyxJQUFJLHFCQUFTLENBQUMsUUFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNoRCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ2IsTUFBTTt3QkFDVixnREFBZ0Q7d0JBQ2hEOzRCQUNJLE1BQU0sQ0FBQyx1RUFBdUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3BHO2dCQUdMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNiLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQ0osQ0FBQztZQUNGLE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUM7S0FBQTtJQUVNLHNCQUFzQixDQUFDLFFBQWtCO1FBRTVDLElBQUksSUFBSSxHQUFHLElBQUkscUJBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsTUFBTSxFQUFFLENBQUM7WUFDVCxlQUFlLEVBQUUsQ0FBQztZQUNsQixTQUFTLEVBQUUsQ0FBQztZQUNaLFNBQVMsRUFBRSxDQUFDO1lBQ1osWUFBWSxFQUFFLENBQUM7WUFDZixLQUFLLEVBQUUsQ0FBQztZQUNSLFVBQVUsRUFBRSxDQUFDO1lBQ2IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxpQkFBaUI7WUFDL0MsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDcEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDMUIsVUFBVSxFQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdkIsVUFBVSxFQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdkIsVUFBVSxFQUFHLFNBQVM7U0FDekIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRVosT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUdKO0FBbkZELDRDQW1GQyJ9