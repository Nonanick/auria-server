import { KernelEntity } from "../KernelEntity";
import { System } from "../../../System";
import { Table } from "../table/Table";
import { DataType } from "../dataType/DataType";
import { SQLType } from "../../../../system/AuriaCore/module/architect/databaseManipulation/definitions/ConnectionColumnDefinition";
export declare class Column extends KernelEntity {
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
    column: string;
    /**
     * Table Name
     * -----------
     * Auria's Table name that hold this column
     */
    tableName: string;
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
    protected defaultValue: string;
    /**
     * Accept Null
     * ------------
     *
     * Nullable
     */
    protected acceptNull: boolean;
    /**
     * Max Length
     * -----------
     *
     */
    protected maxLength: number;
    /**
     *
     */
    protected extra: string;
    /**
     *
     */
    protected rawType: SQLType;
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
    constructor(system: System, table: Table, name: string);
    /**
     * As Json
     * --------
     */
    asJSON(): {
        [prop: string]: any;
    };
    setTitle(title: string): this;
    setDescription(description: string): this;
    setAttributes(attrs: string): this;
    setTableType(tableType: string): this;
    setDataType(dataType: string): this;
    setDefaultValue(value: string): this;
    setMaxLength(length: number): this;
    setNullable(nullable: boolean): this;
    setRawType(type: SQLType): this;
    setExtra(extra: string): this;
    getDataType(): DataType | null;
    isPrimaryKey(): boolean;
    getDefaultValue(): string;
    isNullable(): boolean;
    getMaxLength(): number;
    getExtra(): string;
    getRawType(): SQLType;
}
