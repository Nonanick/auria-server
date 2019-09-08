import { TableAction } from "../TableAction";
import { Table } from "../Table";
export declare class UpdateAction extends TableAction {
    static ActionName: string;
    constructor(table: Table);
    apply(): Promise<boolean>;
}
