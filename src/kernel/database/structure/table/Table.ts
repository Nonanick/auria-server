import { KernelEntity } from "../KernelEntity";
import { Column } from "../column/Column";
import { System, DEFAULT_LANG } from "../../../System";
import { ColumnDataRow } from "../column/ColumnDataRow";
import { TableDataQuery } from "../../dataQuery/TableDataQuery";
import { SystemUser } from "../../../security/SystemUser";
import { Model } from "aurialib2";
import { RowModel } from "../rowModel/RowModel";
import { QueryFilter } from "../../dataQuery/QueryFilter";
import { TableAction } from "./TableAction";
import Knex = require("knex");

export class Table extends KernelEntity {

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
    public title: string;
    /**
     * Description
     * ------------
     * 
     * Short description of this table purpose and structure,also can bemied with 
     * i18n text
     */
    public description: string;

    /**
     * Connection ID
     * -------------
     * 
     * Which connection this table belongs to
     */
    public connectionId: number;

    /**
     * Table
     * ------
     * 
     * Name of the SQL table that thisobject represents
     */
    public table: string;

    /**
     * Descriptive Column
     * ------------------
     * 
     * Which column contains information that somewhat individualizes a row
     * and its at least close to be human readable
     */
    public descriptiveColumn: string;

    /**
     * Distictive Column
     * -----------------
     * 
     * Column with Unique or Primary attribute
     */
    public distinctiveColumn: string;

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
    private buildModelsPromise: Promise<Map<string, Model>>;
    /**
     * Promise: Build Columns
     * -----------------------
     * 
     * Holds the resolved promise ofthe 'buildColumns' fn
     */
    private buildColumnsPromise: Promise<Map<string, Column>>;

    public columnMap: {
        [colName: string]: string;
    } = {};

    public tableActions: Map<string, TableAction>;

    constructor(system: System, name: string) {
        super(system);
        this.name = name;
        this.tableActions = new Map();
    }

    public async getColumns(): Promise<Map<string, Column>> {
        if (this.columns == null) {
            this.columns = await this.buildColumns();
        }

        return this.columns;
    }

    public async buildColumns(): Promise<Map<string, Column>> {
        if (this.buildColumnsPromise == null) {
            this.buildColumnsPromise = new Promise(
                (resolve, reject) => {

                    let cols = new Map<string, Column>();
                    let conn: Knex = this.system.getSystemConnection();

                    conn
                        .select("_id as id", "name", "column", "title", "description", "data_type", "attributes", "table_type", "sql_type", "extra", "length", "default_value")
                        .from("columns")
                        .where("table_name", this.name)
                        .andWhere("active", 1)
                        .then((res) => {
                            (res as ColumnDataRow[]).forEach((cData) => {
                                let col = new Column(this.system, this, cData.name)
                                col.column = cData.column;

                                col
                                    .setDescription(cData.description)
                                    .setDataType(cData.data_type)
                                    .setAttributes(cData.attributes)
                                    .setTitle(cData.title)
                                    .setTableType(cData.table_type)
                                    .setDefaultValue(cData.default_value)
                                    .setMaxLength(cData.length)
                                    .setNullable(cData.nullable == "YES")
                                    .setExtra(cData.extra)
                                    .setRawType(cData.sql_type);
                                cols.set(cData.name, col);
                            });
                            resolve(cols);
                        }).catch((err) => {
                            reject("SQL Error : " + err.message);
                        });

                });
        }

        return this.buildColumnsPromise;
    }

    public getTitle(langVar: string = DEFAULT_LANG) {
        //return this.system.translate(langVar, this.title);
    }
    public getDescription(langVar: string = DEFAULT_LANG) {
        //return this.system.translate(langVar, this.description);
    }

    public getName(): string {
        return this.name;
    }

    public getSystem(): System {
        return this.system;
    }

    /**
     * Return a new query
     * All pre-built filters of this table should be set here!
     */
    public newQuery(): TableDataQuery {
        let q = new TableDataQuery(this.system, this);
        //@todo read pre-built filters from database and apply
        return q;
    }

    public async hasColumn(name: string): Promise<boolean> {
        return await this.getColumn(name) != null;
    }

    /**
     * 
     * @param name Name or column to be searched
     */
    public getColumn(name: string) {

        let matchedCol: Column | null = null;

        // # - Search by name
        if (this.columns.has(name)) {
            matchedCol = this.columns.get(name) as Column;
        }
        // # - Search by table column 
        else {
            this.columns.forEach((col) => {
                if (col.column == name) {
                    matchedCol = col;
                    return false;
                }
                return;
            });
        }

        return matchedCol;
    }

    public asJSON(): { [prop: string]: any; } {
        return {
            name: this.name,
            title: this.getTitle(),
            description: this.getDescription(),
            table: this.table,
            "descriptiveColumn": this.descriptiveColumn,
            connection: this.connectionId,
            "distinctiveColumn": this.distinctiveColumn,
        };
    }

    private buildAllModels(): Promise<Map<string, Model>> {
        if (this.buildModelsPromise == null) {

            this.buildModelsPromise = new Promise<Map<string, Model>>(
                async (resolve, reject) => {
                    let q = this.newQuery();
                    q.fetch()
                        .then((data: any[]) => {
                            data.forEach((data) => {
                                let model: RowModel = this.buildRowModelFromData(data);
                                this.addModel(model, model.getId());
                            });
                            resolve(this.getAllModels());
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
        }
        return this.buildModelsPromise;
    }

    private buildRowModelFromData(data: any): RowModel {
        let model: RowModel;
        if (this.distinctiveColumn != null) {
            model = new RowModel(this, data[this.distinctiveColumn]);
        } else {
            model = new RowModel(this);
        }
        model.setAttribute(data, false);

        return model;
    }

    public async buildModels() {
        return this.buildAllModels();
    }

    public async buildModel(key: string): Promise<RowModel | null> {

        /*if (this._models.has(key)) {
            console.log("[Table] Build model already has key ", key, " Model ", this._models.get(key));
            return this._models.get(key) as RowModel;
        }*/

        let promise = new Promise<RowModel | null>(
            (resolve, reject) => {
                let q = this.newQuery().addFilters(false,
                    new QueryFilter().set(this.distinctiveColumn, "=", key)
                );
                q.fetch().then(async (rows) => {
                    console.log("[Table] Found rows: ", rows.length, await q.getSQL());
                    if (rows.length == 1) {
                        /* this._models.set(key, rows[0]);*/
                        resolve(rows[0]);
                    } else {
                        console.error("[Table] Build Model failed to pinpoint using provided key:", rows);
                        reject("[Table] Key given to table did not return a single value!");
                    }
                }).catch((err) => {
                    console.error("[Table] Failed to quer table searching for key ", key, "\nError: ", err);
                    reject("[Table] Failed to fetch model with key " + key);
                });
            }
        );

        return promise;
    }


    public async getAllModelsFromUser(user: SystemUser): Promise<Map<string, Model>> {

        let promise = new Promise<Map<string, Model>>(
            (resolve, reject) => {

            }
        );

        return promise;

    }

    public getConnection() {
        //@todo make this return th actual table connection estabilished by connection_id
        return this.system.getSystemConnection();
    }
}