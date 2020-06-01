import { EventEmitter } from 'events';
import { TableReferenceDefinition } from './TableReferenceDefinition';
import { SQLTypes } from './SQLTypes.js';

export class ResourceColumn extends EventEmitter {

    public static fromDefinition(colDef : ResourceColumnDefinition) : ResourceColumn {
        let col = new ResourceColumn();


        return col;
    }

    protected _name: string;
    protected _columnName: string;
    protected _sqlType: SQLTypes;
    protected _unique?: boolean;
    protected _unsigned?: boolean;
    protected _index?: boolean;
    protected _primary?: boolean;
    protected _autoIncrement?: boolean;
    protected _references?: TableReferenceDefinition;
    protected _nullable?: boolean;
    protected _length?: number;
    protected _default?: any;
    protected _type: ResourceColumnType = "Physical";

    public getDefinition(): ResourceColumnDefinition {

        let def: ResourceColumnDefinition = {
            name: this._name,
            columnName: this._columnName,
            sqlType: this._sqlType,
            unique: this._unique,
            unsigned: this._unsigned,
            index: this._index,
            primary: this._primary,
            autoIncrement: this._autoIncrement,
            references: this._references,
            nullable: this._nullable,
            length: this._length,
            default: this._default,
            type : this._type,
        };

        return def;
    }

}
export type ResourceColumnType =  "Physical" | "Mask" | "Generated";

export interface ResourceColumnDefinition {
    /**
     * Name of the column, unique inside its resource
     */
    name: string;
    /**
     * SQL Column name that this refers to, might be blank if type != Physical
     */
    columnName: string;
    /**
     * SQL Data type
     */
    sqlType: SQLTypes;
    /**
     * Unique KEY
     * @default false
     */
    unique?: boolean;
    /**
     * Unsigned (only used in numeric values)
     * @default false
     */
    unsigned?: boolean;
    /**
     * INDEX Key
     * @default false
     */
    index?: boolean;
    /**
     * PRIMARY Key
     * @default false
     */
    primary?: boolean;
    /**
     * Auto Increment
     * ! Key must be primary in MySQL / MariaDB
     * @default false
     */
    autoIncrement?: boolean;
    /**
     * SQL Table reference
     * Define a reference to another table/column
     */
    references?: TableReferenceDefinition;
    /**
     * Nullable
     * @default false
     */
    nullable?: boolean;
    /**
     * Max length of the data
     * Not used in all Data Types
     */
    length?: number;
    /**
     * Default Value of this row
     * Might be an SQL Function!
     */
    default?: any;
    /**
     * Column Auria Type
     * Defines how this column should behave
     * 
     * There are 3 possible Types:  
     * 1. Physical - Directly bound to an SQL column
     * 2. Mask - Uses one or more SQL columns and some string literals
     * 3. Calculated - Value is computed in runtime, this column is not bound to an SQL column
     * @default "Physical"
     */
    type? : ResourceColumnType;
}