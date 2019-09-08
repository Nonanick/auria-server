import { TableAction } from "../TableAction";
import { Table } from "../Table";

export class UnlockAction extends TableAction {

    public static ActionName : string = "unlock";

    constructor(table : Table) {
        super(UnlockAction.ActionName, table);
    }

    public async apply(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}