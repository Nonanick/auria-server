import { TableAction } from "../TableAction";
import { Table } from "../Table";

export class DeleteAction extends TableAction {
    public static ActionName : string = "delete";

    constructor(table : Table) {
        super(DeleteAction.ActionName, table);
    }

    public apply(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}