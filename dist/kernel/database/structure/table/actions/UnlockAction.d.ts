import { TableAction } from "../TableAction";
import { Table } from "../Table";
export declare class UnlockAction extends TableAction {
    static ActionName: string;
    constructor(table: Table);
    apply(): Promise<boolean>;
}
