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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvVGFibGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQXNEO0FBS3RELE1BQWEsYUFBYyxTQUFRLCtCQUFjO0lBRzdDLFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBV3BCLGFBQVEsR0FBbUIsQ0FBTyxHQUFHLEVBQUUsRUFBRTtZQUU1Qyx3REFBd0Q7WUFDeEQsSUFBSSxVQUFVLEdBQVEsRUFBRSxDQUFDO1lBRXpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBcUJJO1lBQ0osT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUVsQyxDQUFDLENBQUEsQ0FBQztJQXZDRixDQUFDO0lBRU0seUJBQXlCO1FBQzVCLE9BQU87WUFDSCxVQUFVLEVBQUU7Z0JBQ1Isc0JBQXNCLEVBQUUsSUFBSTthQUMvQjtTQUNKLENBQUM7SUFDTixDQUFDO0NBaUNKO0FBOUNELHNDQThDQyJ9