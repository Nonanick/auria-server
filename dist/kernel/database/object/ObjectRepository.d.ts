import { System } from "../../System";
import { RowModel } from "../structure/rowModel/RowModel";
import { RowObject } from "../structure/rowModel/RowObject";
import { Table } from "../structure/table/Table";
export declare class ObjectRepository {
    protected objects: [];
    protected system: System;
    protected objectTable: Table;
    constructor(system: System);
    getObjectEquivalent(rowModel: RowModel): Promise<RowObject>;
    createObjectToRowModel(rowModel: RowModel): RowObject;
}
