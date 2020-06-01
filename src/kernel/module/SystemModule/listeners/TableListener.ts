import { ModuleListener } from "../../api/ModuleListener.js";
import { Module } from "../../Module.js";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { ListenerAction } from "../../api/ListenerAction.js";

export class TableListener extends ModuleListener {


    constructor(module: Module) {
        super(module, "Table");
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
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