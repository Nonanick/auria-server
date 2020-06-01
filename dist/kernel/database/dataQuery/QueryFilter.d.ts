import { Resource } from "../../resource/Resource.js";
export declare type SQLOperators = "=" | "!=" | "<" | "<=" | "LIKE" | "NOT LIKE" | ">" | ">=" | "<>" | "IN" | "NOT IN";
export declare class QueryFilter {
    setTable(table: import("knex").Table<any, any>): void;
    protected resource: Resource;
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
    setResource(table: Resource): this;
}
