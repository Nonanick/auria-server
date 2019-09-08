/// <reference types="node" />
import { EventEmitter } from "events";
import { RowModel } from "../rowModel/RowModel";
import { Table } from "./Table";
export declare abstract class TableAction extends EventEmitter {
    protected name: string;
    protected rows: RowModel[];
    protected table: Table;
    protected actionPromise: Promise<boolean>;
    private rowsLocked;
    constructor(name: string, table: Table);
    addRow(...rows: RowModel[]): TableAction;
    lockRows(): this;
    abstract apply(): Promise<boolean>;
}
