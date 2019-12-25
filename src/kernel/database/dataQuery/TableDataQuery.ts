import { System } from "../../System";
import { Table } from "../structure/table/Table";
import { QueryFilter } from "./QueryFilter";
import { Column } from "../structure/column/Column";
import { RowModel } from "../structure/rowModel/RowModel";
import { SystemUser } from "../../security/SystemUser";
import { RowObject } from "../structure/rowModel/RowObject";

export type GeneratedSQL = {
    sql: string;
    values: any[];
};

export type OrderQuery = {
    column: string;
    direction: "ASC" | "DESC";
};

export class TableDataQuery {

    private static MAX_RESULTS_DEFAULT: number = 20;

    protected system: System;

    protected table: Table;

    protected columns: string[] | '*';

    /**
     * Filters
     * --------
     * 
     * All filters that will be applied to this query
     * Filters are joined with 'AND' operator and cannot override eachother
     */
    protected filters: QueryFilter[] = [];

    /**
     * Locked Filters
     * --------------
     * 
     * All filters that will be applied t this query and CAN'T
     * be removed once set
     */
    protected lockedFilters: QueryFilter[] = [];

    /**
     * Max Results
     * ------------
     * 
     * Limit the number of rows returned by the query,
     * therefore the query will be "paginated"
     * 
     * # - Default: if only page is set the maxResults will default to 
     * MAX_RESULTS_DEFAULT static value
     */
    protected maxResults: number = 0;

    /**
     * Page
     * -----
     * 
     * Which page of the query should be returned, used with
     * maxResults, to obtain a piece of the query
     * Just like arrays its index is 0 based!
     * 
     * # - Default: if only maxResults is set page will default to 0 (first page)
     */
    protected page: number = 0;

    /**
     * Paging
     * ------
     * 
     * Determine if the query should be paginated, to turn it on
     * set either maxResults or Page
     * 
     * By default pagination is off
     */
    protected _paging: boolean = false;

    /**
     * Order
     * ------
     * 
     * Ordering of the rows
     */
    protected order: OrderQuery[];

    /**
     * [Flag]: Include Inactive
     * -------------------------
     * 
     * Add to query rows with active = 0
     */
    protected _includeInactive = false;

    /**
     * [Flag]: Include Deleted
     * --------------------------
     * 
     * Add to query rows with deleted_at <> null
     */
    protected _includeDeleted = false;

    /**
     * Bound User
     * -----------
     * 
     * To use some flags the user must have enough permissions
     */
    protected _boundUser: SystemUser;

    constructor(system: System, table: Table) {
        this.system = system;
        this.table = table;
        this.filters = [];
        this.order = [];
        this.columns = '*';
    }

    public bindUser(user: SystemUser) {
        if (this._boundUser == null)
            this._boundUser = user;
        else
            console.error("[TableDataQuery] This table data query already has a bound user");

        return this;
    }
    public setColumns(columns: string[] | '*') {
        this.columns = columns;
        return this;
    }

    public includeDeleted(): TableDataQuery {

        if (this._boundUser != null) {

        }
        return this;
    }

    public includeInactive(): TableDataQuery {

        if (this._boundUser != null) {

        }

        return this;
    }

    /**
     * Add a Collumn to be fetched by this query
     * 
     * @param columns 
     */
    public async addColumns(...columns: string[]) {

        if (this.columns == '*') {
            this.columns = [];
        }

        columns.forEach((col) => {
            (this.columns as string[]).push(col);
        });

        return this;
    }

    public addOrder(order: OrderQuery): TableDataQuery {
        this.order.push(order);
        return this;
    }

    /**
     * 
     * @param filters 
     */
    public setFilters(...filters: QueryFilter[]) {
        this.filters = [];
        filters.forEach((f) => {
            this.addFilters(false, f);
        });
    }

    /**
     * 
     * @param filters 
     */
    public addFilters(locked: boolean, ...filters: QueryFilter[]) {
        filters.forEach((filter) => {
            filter.setTable(this.table);
        });
        if (locked) {
            this.lockedFilters = this.lockedFilters.concat(filters);
        } else {
            this.filters = this.filters.concat(filters);
        }
        return this;
    }

    protected async getTableColumns(which: '*' | string[]) {
        let promise = new Promise<Column[]>((
            resolve: (cols: Column[]) => void,
            reject: (err: any) => void
        ) => {
            this.table.getColumns().then((map) => {
                if (which == '*') {
                    resolve(Array.from(map.values()));
                } else {
                    let cols: Column[] = [];

                    which.forEach((colName) => {
                        if (map.get(colName) != null) {
                            cols.push(map.get(colName) as Column);
                        } else {
                            console.error("[TableDataQuery] Requested column '" + colName + "' does not exist in Auria!");
                        }
                    });

                    resolve(cols);
                }
            }).catch((err) => {
                reject("[TableDataQuery] Failed to get table columns! " + err.message);
            });
        });

        return promise;
    }

    public setMaxNumberOfRows(amount: number): TableDataQuery {
        if (amount >= 0) {
            this._paging = true;
            this.maxResults = Math.round(amount);
        } else if (amount == 0) {
            this._paging = false;
        } else {
            throw new Error("[TableDataQuery] Max number of rows must be positive!");
        }
        return this;
    }

    /**
     * Page
     * -----
     * 
     * Define which page should be used
     * @param page 
     */
    public setPage(page: number): TableDataQuery {
        if (page >= 0) {
            this._paging = true;
            this.page = Math.round(page);

            // # - Page set but Max Results isn't
            if (this.maxResults == 0) {
                this.maxResults = TableDataQuery.MAX_RESULTS_DEFAULT;
            }
        } else {
            this._paging = false;
        }
        return this;
    }


    public async getSQL(): Promise<GeneratedSQL> {

        let values: any[] = [];

        // SELECT FROM
        let sql = "SELECT " + await this.generateColumnsSQL();

        if (this.table.getName() != "Auria.Object") {
            sql +=
                " , obj.`lock_time`      as object_lock_time, "
                + "obj.`_id`             as object_true_id, "
                + "obj.`lock_user`       as object_lock_user, "
                + "obj.`active`          as object_active, "
                + "obj.`created_at`      as object_created_at, "
                + "obj.`updated_at`      as object_updated_at, "
                + "obj.`owner`           as object_owner, "
                + "obj.`owner_role`      as object_owner_role, "
                + "obj.`current_version` as object_current_version, "
                + "obj.`next_version`    as object_next_version ";
        }

        sql += " FROM `" + this.table.table + "`";
        ''
        if (this.table.getName() != "Auria.Object") {
            sql += "LEFT JOIN `object` as obj ON "
                + "`obj`.`table_id` = `" + this.table.table + "`.`" + this.table.distinctiveColumn + "`"
                + "AND `obj`.`table` = '" + this.table.table + "' ";
        }

        // # - WHERE
        let condition: string = "";
        let conditionsSQL: string[] = [];

        this.filters.forEach((filter) => {
            conditionsSQL.push(filter.getSQL());
            values = values.concat(filter.getValues());
        });
        if (conditionsSQL.length > 0) {
            condition = " WHERE " + conditionsSQL.join(' AND ');
        }

        sql += condition;

        // ORDER BY
        if (this.order.length > 0) {
            sql += this.generateOrderSQL();
        }

        // # - LIMIT
        if (this._paging) {
            let limit: string =
                "LIMIT " + this.maxResults + " "
                + (this.page > 0 ? " OFFSET " + this.page : "");

            sql += limit;
        }

        return {
            sql: sql,
            values: values
        };
    }

    /**
     * Return all the columns as a string separated by comma
     */
    private async generateColumnsSQL(): Promise<string> {
        let columnsArr: Column[] = await this.getTableColumns(this.columns);
        let strArr: string[] = [];

        columnsArr.forEach((col) => {
            strArr.push("`" + this.table.table + "`.`" + col.column + "`");
        });

        return strArr.join(' , ');
    }

    private generateOrderSQL(): string {

        let sql: string = this.order.length > 0 ? "ORDER BY " : "";
        let orders: string[] = [];

        this.order.forEach((or) => {
            orders.push(or.column + " " + or.direction);
        });

        return sql + orders.join(' , ');
    }


    public getSQLString(): string {
        return '';
    }

    public async fetch(): Promise<RowModel[]> {

        let promise =
            this.getSQL()
                .then((sql) => {
                    let conn = this.system.getSystemConnection();
                    return conn.raw(sql.sql, sql.values);
                })
                .then((res) => {
                    let models: RowModel[] = [];
                    if (Array.isArray(res)) {
                        for (var c = 0; c < res.length; c++) {
                            let mData = res[c];
                            let id = mData[this.table.distinctiveColumn];
                            let nModel = this.buildRowModelFromQueryResult(id, mData);
                            models.push(nModel);
                        }
                    }
                    return models;
                });

        promise.catch((err) => {
            console.error("[TableDataQuery] Failed to fetch data from table!\n", err);
        });

        return promise;
    }

    private buildRowModelFromQueryResult(id: any, data: any): RowModel {

        let nModel = new RowModel(this.table, id);
        let objEq = new RowObject(nModel);

        objEq.setInfo({
            active: data.object_active,
            created_at: data.object_created_at,
            current_version: data.object_current_version,
            deleted_at: data.object_deleted_at,
            lock_time: data.object_lock_time,
            lock_user: data.object_lock_user,
            next_version: data.object_next_version,
            owner: data.object_owner,
            owner_role: data.object_owner_role,
            pk_field: this.table.distinctiveColumn,
            table: this.table.table,
            table_id: id,
            updated_at: data.object_updated_at
        });

        // # - Delete object info from model 
        for (var attr in data) {
            if (data.hasOwnProperty(attr)) {
                if ([
                    "object_active",
                    "object_created_at",
                    "object_current_version",
                    "object_deleted_at",
                    "object_lock_time",
                    "object_lock_user",
                    "object_next_version",
                    "object_owner",
                    "object_owner_role",
                    "object_true_id",
                    "object_updated_at"
                ].indexOf(attr) >= 0) {
                    delete (data[attr]);
                }
            }
        }

        nModel.setAttribute(data, false);
        nModel.seObject(objEq);

        return nModel;
    }
}