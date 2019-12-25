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
    getRequiredRequestHandlers() {
        return [];
    }
    getExposedActionsDefinition() {
        return {
            "metadata": {}
        };
    }
}
exports.TableListener = TableListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvVGFibGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQWlHO0FBSWpHLE1BQWEsYUFBYyxTQUFRLCtCQUFjO0lBTzdDLFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBU3BCLGFBQVEsR0FBbUIsQ0FBTyxHQUFHLEVBQUUsRUFBRTtZQUU3Qyx3REFBd0Q7WUFDdkQsSUFBSSxVQUFVLEdBQVEsRUFBRSxDQUFDO1lBRTFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBcUJJO1lBQ0gsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUVsQyxDQUFDLENBQUEsQ0FBQztJQXJDRixDQUFDO0lBUE0sMEJBQTBCO1FBQzdCLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQU9NLDJCQUEyQjtRQUM5QixPQUFPO1lBQ0gsVUFBVSxFQUFFLEVBQUU7U0FDakIsQ0FBQztJQUNOLENBQUM7Q0FpQ0o7QUFoREQsc0NBZ0RDIn0=