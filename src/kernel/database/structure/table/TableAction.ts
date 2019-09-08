import { EventEmitter } from "events";
import { RowModel } from "../rowModel/RowModel";
import { Table } from "./Table";

export abstract class TableAction extends EventEmitter {

    protected name: string;

    protected rows : RowModel[];

    protected table : Table;

    protected actionPromise : Promise<boolean>;

    private rowsLocked : boolean = false;

    constructor(name : string, table : Table) {
        super();
        this.name = name;
        this.rows = [];
        this.table = table;
    }

    public addRow(...rows : RowModel[]) : TableAction {
        if(!this.rowsLocked)
            this.rows = this.rows.concat(rows);
            
        return this;
    }

    public lockRows() {
        this.rowsLocked = true;
        return this;
    }

    public abstract async apply() : Promise<boolean>;

}