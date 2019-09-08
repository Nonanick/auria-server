import { ModuleListener, ListenerAction, ListenerActionsDefinition } from "../../ModuleListener";
import { Module } from "../../Module";
import { Column } from "../../../database/structure/column/Column";
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";

export class TableListener extends ModuleListener {

    public getRequiredRequestHandlers(): AuriaMiddleware[] {
        return [];
    }


    constructor(module: Module) {
        super(module, "Table");
    }

    public getExposedActionsDefinition(): ListenerActionsDefinition {
        return {
            "metadata": {}
        };
    }

    public metadata: ListenerAction = async (req, res) => {

        let tables = req.requiredParam('tables') as string[];
        let tablesInfo: any = {};

        try {
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
        }
        res.addToResponse({ tables: tablesInfo });
        res.send();
    };

}