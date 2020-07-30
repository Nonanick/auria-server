var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModuleListener } from "../../api/ModuleListener.js";
export class TableListener extends ModuleListener {
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
    getMetadataFromExposedActions() {
        return {
            "metadata": {
                DISABLE_WHITELIST_RULE: true
            }
        };
    }
}
//# sourceMappingURL=TableListener.js.map