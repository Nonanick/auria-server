"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KernelEntity_1 = require("../KernelEntity");
class Column extends KernelEntity_1.KernelEntity {
    constructor(system, table, name) {
        super(system);
        /**
         * Table Name
         * -----------
         * Auria's Table name that hold this column
         */
        this.tableName = "";
        this.table = table;
        this.name = name;
        this.tableName = this.table.table;
    }
    /**
     * As Json
     * --------
     */
    asJSON() {
        return {
            "table": this.tableName,
            "column": this.column,
            "name": this.name,
            "title": this.title,
            "description": this.description,
            "dataType": this.dataType,
            "defaultValue": this.defaultValue,
            "maxLength": this.maxLength,
            "nullable": this.acceptNull,
            "tableType": this.tableType
        };
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    setAttributes(attrs) {
        this.attributes = attrs;
        return this;
    }
    setTableType(tableType) {
        this.tableType = tableType;
        return this;
    }
    setDataType(dataType) {
        this.dataType = dataType;
        return this;
    }
    setDefaultValue(value) {
        this.defaultValue = value;
        return this;
    }
    setMaxLength(length) {
        this.maxLength = length;
        return this;
    }
    setNullable(nullable) {
        this.acceptNull = nullable;
        return this;
    }
    setRawType(type) {
        this.rawType = type;
        return this;
    }
    setExtra(extra) {
        this.extra = extra;
        return this;
    }
    getDataType() {
        let dt = this.system.getDataType(this.dataType);
        if (dt == null) {
            console.error("[Column] DataType is null!:", this.dataType);
        }
        return dt;
    }
    isPrimaryKey() {
        return this.attributes.toLocaleUpperCase().indexOf("PRI") >= 0;
    }
    getDefaultValue() {
        return this.defaultValue;
    }
    isNullable() {
        return this.acceptNull;
    }
    getMaxLength() {
        return this.maxLength;
    }
    getExtra() {
        return this.extra;
    }
    getRawType() {
        return this.rawType;
    }
}
exports.Column = Column;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvY29sdW1uL0NvbHVtbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUErQztBQU0vQyxNQUFhLE1BQU8sU0FBUSwyQkFBWTtJQWtKcEMsWUFBWSxNQUFjLEVBQUUsS0FBWSxFQUFFLElBQVk7UUFDbEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBekhsQjs7OztXQUlHO1FBQ0ksY0FBUyxHQUFXLEVBQUUsQ0FBQztRQXFIMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTTtRQUNULE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDbkIsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQy9CLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN6QixjQUFjLEVBQUcsSUFBSSxDQUFDLFlBQVk7WUFDbEMsV0FBVyxFQUFHLElBQUksQ0FBQyxTQUFTO1lBQzVCLFVBQVUsRUFBRyxJQUFJLENBQUMsVUFBVTtZQUM1QixXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDOUIsQ0FBQztJQUNOLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sY0FBYyxDQUFDLFdBQW1CO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxhQUFhLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxXQUFXLENBQUMsUUFBZ0I7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLGVBQWUsQ0FBQyxLQUFjO1FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxZQUFZLENBQUMsTUFBZTtRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sV0FBVyxDQUFDLFFBQWtCO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxVQUFVLENBQUMsSUFBYztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sUUFBUSxDQUFDLEtBQWM7UUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLFdBQVc7UUFDZCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBRyxFQUFFLElBQUcsSUFBSSxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRU0sZUFBZTtRQUNsQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVNLFVBQVU7UUFDYixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVNLFVBQVU7UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztDQUdKO0FBL1BELHdCQStQQyJ9