import { ModuleListener } from "../../ModuleListener";
import { Module } from "../../Module";
import { ListenerAction } from "../../ListenerAction";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata";

export class TableListener extends ModuleListener {


    constructor(module: Module) {
        super(module, "Table");
    }

    public getExposedActionsMetadata(): AuriaListenerActionMetadata {
        return {
            "metadata": {
                DISABLE_WHITELIST_RULE: true
            }
        };
    }

    public metadata: ListenerAction = async (req) => {

        // let tables = req.requiredParam('tables') as string[];
        let tablesInfo: any = {};

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

    };

}