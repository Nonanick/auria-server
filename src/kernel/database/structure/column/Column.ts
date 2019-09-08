import { KernelEntity } from "../KernelEntity";
import { System } from "../../../System";
import { Table } from "../table/Table";
import { DataType } from "../dataType/DataType";
import { SQLType } from "../../../../system/AuriaCore/module/architect/databaseManipulation/definitions/ConnectionColumnDefinition";

export class Column extends KernelEntity {

    /**
     * Table
     * ------
     * 
     * Table object that hold this column
     */
    protected table: Table;

    /**
     * Name
     * -----
     * 
     * Column name, unique inside the table
     */
    protected name: string;

    /**
     * Column
     * ------
     * 
     * Column name, 
     */
    public column: string;

    /**
     * Table Name
     * -----------
     * Auria's Table name that hold this column
     */
    public tableName: string = "";

    /**
     * Title
     * ------
     * 
     * Human readable title for this column, might be an i18n text
     */
    protected title: string;

    /**
     * Description
     * -----------
     * 
     * Human readable description for this column, might be an i18n text
     */
    protected description: string;

    /**
     * Table Type
     * ----------
     * 
     * Type of the data source we shall call "Table", Auria can
     * access Temporary Tables or even SQL queries as a "Table",
     * therefore some actions mght be limited to tables that are 
     * not "physic";
     * 
     * Types of Table:
     * >> Physic;
     * >> SQL Query;
     * >> Temp Table;
     * >> Some Streams (?) o any other data source that accepts SQL Queries;
     */
    protected tableType: string;

    /**
     * Data Type
     * ---------
     * 
     * Which type of data this column holds, consider it as an 
     * extension of th raw SQL Types, ou can change the behaviour
     * of model and value manipulation inside budled in data types
     * 
     *  [Example]
     *  
     *  "i18ntext", is a special kind of string that is searched through
     *  for tokens such as "@{Name of Text Resource}" and replaced by the corresponding
     *  value in the text resource table respecting the lang of the user
     * 
     */
    protected dataType: string;

    /**
     * SQL Attributes
     * --------------
     * 
     * A comma separated list of columns SQL Attributes such as:
     * >> IND, UNI, PRI, AI and so on
     */
    protected attributes: string;

    /**
     * Default Value
     * --------------
     */
    protected defaultValue : string;

    /**
     * Accept Null
     * ------------
     * 
     * Nullable
     */
    protected acceptNull : boolean;

    /**
     * Max Length
     * -----------
     * 
     */
    protected maxLength : number;

    /**
     * 
     */
    protected extra : string;

    /**
     * 
     */
    protected rawType : SQLType;

    /**
     * Allow Modification
     * ------------------
     * 
     * While not in Development Env this attribute prevents the Column row from being edited
     */
    protected allowModification: boolean;

    /**
     * Created At
     * ----------
     * 
     * ** Will be moved to object table
     */
    protected createdAt: Date;

    /**
     * Updated At
     * -----------
     * ** Will be moved to object table
     */
    protected updatedAt: Date;

    constructor(system: System, table: Table, name: string) {
        super(system);
        this.table = table;
        this.name = name;
        this.tableName = this.table.table;
    }

    /**
     * As Json
     * --------
     */
    public asJSON(): { [prop: string]: any; } {
        return {
            "table": this.tableName,
            "column": this.column,
            "name": this.name,
            "title": this.title,
            "description": this.description,
            "dataType": this.dataType,
            "defaultValue" : this.defaultValue,
            "maxLength" : this.maxLength,
            "nullable" : this.acceptNull,
            "tableType": this.tableType
        };
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setDescription(description: string) {
        this.description = description;
        return this;
    }

    public setAttributes(attrs: string) {
        this.attributes = attrs;
        return this;
    }

    public setTableType(tableType: string) {
        this.tableType = tableType;
        return this;
    }

    public setDataType(dataType: string) {
        this.dataType = dataType;
        return this;
    }

    public setDefaultValue(value : string) {
        this.defaultValue = value;
        return this;
    }

    public setMaxLength(length : number) {
        this.maxLength = length;
        return this;
    }

    public setNullable(nullable : boolean) {
        this.acceptNull = nullable;
        return this;
    }

    public setRawType(type : SQLType) {
        this.rawType = type;
        return this;
    }

    public setExtra(extra : string) {
        this.extra = extra;
        return this;
    }

    public getDataType(): DataType {
        let dt = this.system.getDataType(this.dataType);
        if(dt== null) {
            console.error("[Column] DataType is null!:", this.dataType);
        }
        return dt;
    }

    public isPrimaryKey() : boolean {
        return this.attributes.toLocaleUpperCase().indexOf("PRI") >= 0;
    }

    public getDefaultValue() : string {
        return this.defaultValue;
    }

    public isNullable() : boolean {
        return this.acceptNull;
    }

    public getMaxLength() : number {
        return this.maxLength;
    }

    public getExtra() : string {
        return this.extra;
    }

    public getRawType() : SQLType {
        return this.rawType;
    }


}