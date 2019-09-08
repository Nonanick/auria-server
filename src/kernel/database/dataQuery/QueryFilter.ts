import { Table } from "../structure/table/Table";

export type SQLOperators = "=" | "!=" | "<" | "<=" | "LIKE" | "NOT LIKE" | ">" | ">=" | "<>" | "IN" | "NOT IN";

export class QueryFilter {

    protected table : Table;

    protected values: any[] = [];

    protected operator: SQLOperators = "=";

    protected columnName: string = "1";

    protected value: string = '1';

    constructor(params?: { columnName: string, op: SQLOperators, escapedValues: string | any[] }) {
        
        if(params !=null) {
            this.set(params.columnName, params.op, params.escapedValues);
        }

    }
    public set(columnName: string, op: SQLOperators, escapedValues: string | any[]): QueryFilter {

        if (op == "LIKE" || op == "NOT LIKE") {
            escapedValues = "%" + escapedValues + "%";
        }

        if(op == "IN" || op == "NOT IN") {
            if(!Array.isArray(escapedValues)){
                throw new Error("[QueryFilter] 'IN' and 'NOT IN' SQLOperator expect an array as a value");
            }
        }

        this.value = "?";
        this.columnName = columnName;
        this.operator = op;

        if (Array.isArray(escapedValues)) {
            this.values.concat(escapedValues);
        } else {
            this.values.push(escapedValues);
        }

        return this;
    }

    public getSQL(): string {

        let query = "( "
         + (this.table == null ? "" : "`" + this.table.table + "`.") 
         + "`" + this.columnName + "` " 
         + this.operator + " " 
         + this.value + " ) ";
        return query;
    }

    public getValues(): any[] {
        return this.values;
    }

    public getColumnName(): string {
        return this.columnName;
    }

    public setTable(table : Table) {
        this.table = table;
        return this;
    }
}