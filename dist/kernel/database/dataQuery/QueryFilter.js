export class QueryFilter {
    constructor(params) {
        this.values = [];
        this.operator = "=";
        this.columnName = "1";
        this.value = '1';
        if (params != null) {
            this.set(params.columnName, params.op, params.escapedValues);
        }
    }
    setTable(table) {
        throw new Error("Method not implemented.");
    }
    set(columnName, op, escapedValues) {
        if (op == "LIKE" || op == "NOT LIKE") {
            escapedValues = "%" + escapedValues + "%";
        }
        if (op == "IN" || op == "NOT IN") {
            if (!Array.isArray(escapedValues)) {
                throw new Error("[QueryFilter] 'IN' and 'NOT IN' SQLOperator expect an array as a value");
            }
        }
        this.value = "?";
        this.columnName = columnName;
        this.operator = op;
        if (Array.isArray(escapedValues)) {
            this.values.concat(escapedValues);
        }
        else {
            this.values.push(escapedValues);
        }
        return this;
    }
    getSQL() {
        let query = "( "
            + (this.resource == null ? "" : "`" + this.resource.tableName + "`.")
            + "`" + this.columnName + "` "
            + this.operator + " "
            + this.value + " ) ";
        return query;
    }
    getValues() {
        return this.values;
    }
    getColumnName() {
        return this.columnName;
    }
    setResource(table) {
        this.resource = table;
        return this;
    }
}
