import { KernelEntity } from "../KernelEntity";
import { Column } from "../column/Column";
import { System } from "../../../System";
import { TableDataQuery } from "../../dataQuery/TableDataQuery";
import { SystemUser } from "../../../security/SystemUser";
import { Model } from "aurialib2";
import { RowModel } from "../rowModel/RowModel";
import { TableAction } from "./TableAction";
import Knex = require("knex");
export declare class Table extends KernelEntity {
    /**
     * Name
     * -------
     *
     * Table unique identifier inside Auria
     */
    protected name: string;
    /**
     * Title
     * -----
     *
     * Human readable titl of this table, might be mixed with i18n text
     * To get the resolved value use 'getTitle' instead
     */
    title: string;
    /**
     * Description
     * ------------
     *
     * Short description of this table purpose and structure,also can bemied with
     * i18n text
     */
    description: string;
    /**
     * Connection ID
     * -------------
     *
     * Which connection this table belongs to
     */
    connectionId: number;
    /**
     * Table
     * ------
     *
     * Name of the SQL table that thisobject represents
     */
    table: string;
    /**
     * Descriptive Column
     * ------------------
     *
     * Which column contains information that somewhat individualizes a row
     * and its at least close to be human readable
     */
    descriptiveColumn: string;
    /**
     * Distictive Column
     * -----------------
     *
     * Column with Unique or Primary attribute
     */
    distinctiveColumn: string;
    /**
     * Allow Modification
     * ------------------
     *
     * When in production locks a table making it impossible
     * to edit it using the system
     */
    protected allowModification: boolean;
    /**
     * Created At
     * ----------
     *
     * Date that this table was created
     */
    protected createdAt: Date;
    /**
     * Updated At
     * ----------
     *
     */
    protected updatedAt: Date;
    /**
     * Map: Columns
     * ------------
     *
     * A Map containing all the columns that belong to this table
     */
    protected columns: Map<string, Column>;
    /**
     * Promise: Build Models
     * ----------------------
     *
     * Holds the resolved promise of the 'buildModels' fn
     */
    private buildModelsPromise;
    /**
     * Promise: Build Columns
     * -----------------------
     *
     * Holds the resolved promise ofthe 'buildColumns' fn
     */
    private buildColumnsPromise;
    columnMap: {
        [colName: string]: string;
    };
    tableActions: Map<string, TableAction>;
    constructor(system: System, name: string);
    getColumns(): Promise<Map<string, Column>>;
    buildColumns(): Promise<Map<string, Column>>;
    getTitle(langVar?: string): void;
    getDescription(langVar?: string): void;
    getName(): string;
    getSystem(): System;
    /**
     * Return a new query
     * All pre-built filters of this table should be set here!
     */
    newQuery(): TableDataQuery;
    hasColumn(name: string): Promise<boolean>;
    /**
     *
     * @param name Name or column to be searched
     */
    getColumn(name: string): Column | null;
    asJSON(): {
        [prop: string]: any;
    };
    private buildAllModels;
    private buildRowModelFromData;
    buildModels(): Promise<Map<string, Model>>;
    buildModel(key: string): Promise<RowModel | null>;
    getAllModelsFromUser(user: SystemUser): Promise<Map<string, Model>>;
    getConnection(): Knex<any, any[]>;
}
