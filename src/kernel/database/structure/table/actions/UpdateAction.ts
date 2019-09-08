import { TableAction } from "../TableAction";
import { Table } from "../Table";

export class UpdateAction extends TableAction {

    public static ActionName : string = "update";

    constructor(table : Table) {
        super(UpdateAction.ActionName, table);
    }

    public apply(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}