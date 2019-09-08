import { TableAction } from "../TableAction";
import { Table } from "../Table";
export declare class LockAction extends TableAction {
    static ActionName: string;
    constructor(table: Table);
    apply(): Promise<boolean>;
}
