import { Table } from "../structure/table/Table";
export declare type SQLOperators = "=" | "!=" | "<" | "<=" | "LIKE" | "NOT LIKE" | ">" | ">=" | "<>" | "IN" | "NOT IN";
export declare class QueryFilter {
    protected table: Table;
    protected values: any[];
    protected operator: SQLOperators;
    protected columnName: string;
    protected value: string;
    constructor(params?: {
        columnName: string;
        op: SQLOperators;
        escapedValues: string | any[];
    });
    set(columnName: string, op: SQLOperators, escapedValues: string | any[]): QueryFilter;
    getSQL(): string;
    getValues(): any[];
    getColumnName(): string;
    setTable(table: Table): this;
}
