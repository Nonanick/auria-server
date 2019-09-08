"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryFilter {
    constructor(params) {
        this.values = [];
        this.operator = "=";
        this.columnName = "1";
        this.value = '1';
        if (params != null) {
            this.set(params.columnName, params.op, params.escapedValues);
        }
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
            + (this.table == null ? "" : "`" + this.table.table + "`.")
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
    setTable(table) {
        this.table = table;
        return this;
    }
}
exports.QueryFilter = QueryFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVlcnlGaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL2RhdGFRdWVyeS9RdWVyeUZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE1BQWEsV0FBVztJQVlwQixZQUFZLE1BQWdGO1FBUmxGLFdBQU0sR0FBVSxFQUFFLENBQUM7UUFFbkIsYUFBUSxHQUFpQixHQUFHLENBQUM7UUFFN0IsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUV6QixVQUFLLEdBQVcsR0FBRyxDQUFDO1FBSTFCLElBQUcsTUFBTSxJQUFHLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNoRTtJQUVMLENBQUM7SUFDTSxHQUFHLENBQUMsVUFBa0IsRUFBRSxFQUFnQixFQUFFLGFBQTZCO1FBRTFFLElBQUksRUFBRSxJQUFJLE1BQU0sSUFBSSxFQUFFLElBQUksVUFBVSxFQUFFO1lBQ2xDLGFBQWEsR0FBRyxHQUFHLEdBQUcsYUFBYSxHQUFHLEdBQUcsQ0FBQztTQUM3QztRQUVELElBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksUUFBUSxFQUFFO1lBQzdCLElBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFDO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7YUFDN0Y7U0FDSjtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBRW5CLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyQzthQUFNO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbkM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sTUFBTTtRQUVULElBQUksS0FBSyxHQUFHLElBQUk7Y0FDYixDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Y0FDekQsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSTtjQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUc7Y0FDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdEIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVNLGFBQWE7UUFDaEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFsRUQsa0NBa0VDIn0=