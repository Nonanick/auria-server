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
const ModuleListener_1 = require("../../ModuleListener");
class TableListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "Table");
        this.metadata = (req) => __awaiter(this, void 0, void 0, function* () {
            // let tables = req.requiredParam('tables') as string[];
            let tablesInfo = {};
            /* try {
                 for (let a = 0; a < tables.length; a++) {
     
                     let tableObj = await this.module.getTable(req.getUser(), tables[a]);
                     let info: any = {};
     
                     if (tableObj != null) {
                         //Table Info
                         info = tableObj.asJSON();
                         //Load columns Info
                         info.columns = [];
                         let cols = await tableObj.getColumns();
                         cols.forEach((col: Column) => {
                             info.columns.push(col.asJSON());
                         });
                         tablesInfo[tables[a]] = info;
                     }
                 };
             } catch (error) {
                
                 throw new Error("[Table] Failed to fetch table info! " + error);
             }*/
            return { tables: tablesInfo };
        });
    }
    getExposedActionsMetadata() {
        return {
            "metadata": {
                DISABLE_WHITELIST_RULE: true
            }
        };
    }
}
exports.TableListener = TableListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvVGFibGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlEQUFzRDtBQUt0RCxNQUFhLGFBQWMsU0FBUSwrQkFBYztJQUc3QyxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQVdwQixhQUFRLEdBQW1CLENBQU8sR0FBRyxFQUFFLEVBQUU7WUFFNUMsd0RBQXdEO1lBQ3hELElBQUksVUFBVSxHQUFRLEVBQUUsQ0FBQztZQUV6Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQXFCSTtZQUNKLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUM7UUFFbEMsQ0FBQyxDQUFBLENBQUM7SUF2Q0YsQ0FBQztJQUVNLHlCQUF5QjtRQUM1QixPQUFPO1lBQ0gsVUFBVSxFQUFFO2dCQUNSLHNCQUFzQixFQUFFLElBQUk7YUFDL0I7U0FDSixDQUFDO0lBQ04sQ0FBQztDQWlDSjtBQTlDRCxzQ0E4Q0MifQ==