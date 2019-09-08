import { System } from "../../System";
import { Table } from "../structure/table/Table";
import { QueryFilter } from "./QueryFilter";
import { Column } from "../structure/column/Column";
import { RowModel } from "../structure/rowModel/RowModel";
import { SystemUser } from "../../security/SystemUser";
export declare type GeneratedSQL = {
    sql: string;
    values: any[];
};
export declare type OrderQuery = {
    column: string;
    direction: "ASC" | "DESC";
};
export declare class TableDataQuery {
    private static MAX_RESULTS_DEFAULT;
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
    protected filters: QueryFilter[];
    /**
     * Locked Filters
     * --------------
     *
     * All filters that will be applied t this query and CAN'T
     * be removed once set
     */
    protected lockedFilters: QueryFilter[];
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
    protected maxResults: number;
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
    protected page: number;
    /**
     * Paging
     * ------
     *
     * Determine if the query should be paginated, to turn it on
     * set either maxResults or Page
     *
     * By default pagination is off
     */
    protected _paging: boolean;
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
    protected _includeInactive: boolean;
    /**
     * [Flag]: Include Deleted
     * --------------------------
     *
     * Add to query rows with deleted_at <> null
     */
    protected _includeDeleted: boolean;
    /**
     * Bound User
     * -----------
     *
     * To use some flags the user must have enough permissions
     */
    protected _boundUser: SystemUser;
    constructor(system: System, table: Table);
    bindUser(user: SystemUser): this;
    setColumns(columns: string[] | '*'): this;
    includeDeleted(): TableDataQuery;
    includeInactive(): TableDataQuery;
    /**
     * Add a Collumn to be fetched by this query
     *
     * @param columns
     */
    addColumns(...columns: string[]): Promise<this>;
    addOrder(order: OrderQuery): TableDataQuery;
    /**
     *
     * @param filters
     */
    setFilters(...filters: QueryFilter[]): void;
    /**
     *
     * @param filters
     */
    addFilters(locked: boolean, ...filters: QueryFilter[]): this;
    protected getTableColumns(which: '*' | string[]): Promise<Column[]>;
    setMaxNumberOfRows(amount: number): TableDataQuery;
    /**
     * Page
     * -----
     *
     * Define which page should be used
     * @param page
     */
    setPage(page: number): TableDataQuery;
    getSQL(): Promise<GeneratedSQL>;
    /**
     * Return all the columns as a string separated by comma
     */
    private generateColumnsSQL;
    private generateOrderSQL;
    getSQLString(): string;
    fetch(): Promise<RowModel[]>;
    private buildRowModelFromQueryResult;
}
