import { TableAction } from "../TableAction";
import { Table } from "../Table";

export class LockAction extends TableAction {

    public static ActionName : string = "lock";

    constructor(table : Table) {
        super(LockAction.ActionName, table);
    }

    public apply(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}