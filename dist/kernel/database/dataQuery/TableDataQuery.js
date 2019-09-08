"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const RowModel_1 = require("../structure/rowModel/RowModel");
const RowObject_1 = require("../structure/rowModel/RowObject");
class TableDataQuery {
    constructor(system, table) {
        /**
         * Filters
         * --------
         *
         * All filters that will be applied to this query
         * Filters are joined with 'AND' operator and cannot override eachother
         */
        this.filters = [];
        /**
         * Locked Filters
         * --------------
         *
         * All filters that will be applied t this query and CAN'T
         * be removed once set
         */
        this.lockedFilters = [];
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
        this.maxResults = 0;
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
        this.page = 0;
        /**
         * Paging
         * ------
         *
         * Determine if the query should be paginated, to turn it on
         * set either maxResults or Page
         *
         * By default pagination is off
         */
        this._paging = false;
        /**
         * [Flag]: Include Inactive
         * -------------------------
         *
         * Add to query rows with active = 0
         */
        this._includeInactive = false;
        /**
         * [Flag]: Include Deleted
         * --------------------------
         *
         * Add to query rows with deleted_at <> null
         */
        this._includeDeleted = false;
        this.system = system;
        this.table = table;
        this.filters = [];
        this.order = [];
        this.columns = '*';
    }
    bindUser(user) {
        if (this._boundUser == null)
            this._boundUser = user;
        else
            console.error("[TableDataQuery] This table data query already has a bound user");
        return this;
    }
    setColumns(columns) {
        this.columns = columns;
        return this;
    }
    includeDeleted() {
        if (this._boundUser != null) {
        }
        return this;
    }
    includeInactive() {
        if (this._boundUser != null) {
        }
        return this;
    }
    /**
     * Add a Collumn to be fetched by this query
     *
     * @param columns
     */
    addColumns(...columns) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.columns == '*') {
                this.columns = [];
            }
            columns.forEach((col) => {
                this.columns.push(col);
            });
            return this;
        });
    }
    addOrder(order) {
        this.order.push(order);
        return this;
    }
    /**
     *
     * @param filters
     */
    setFilters(...filters) {
        this.filters = [];
        filters.forEach((f) => {
            this.addFilters(false, f);
        });
    }
    /**
     *
     * @param filters
     */
    addFilters(locked, ...filters) {
        filters.forEach((filter) => {
            filter.setTable(this.table);
        });
        if (locked) {
            this.lockedFilters = this.lockedFilters.concat(filters);
        }
        else {
            this.filters = this.filters.concat(filters);
        }
        return this;
    }
    getTableColumns(which) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                this.table.getColumns().then((map) => {
                    if (which == '*') {
                        resolve(Array.from(map.values()));
                    }
                    else {
                        let cols = [];
                        which.forEach((colName) => {
                            if (map.get(colName) != null) {
                                cols.push(map.get(colName));
                            }
                            else {
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
        });
    }
    setMaxNumberOfRows(amount) {
        if (amount >= 0) {
            this._paging = true;
            this.maxResults = Math.round(amount);
        }
        else if (amount == 0) {
            this._paging = false;
        }
        else {
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
    setPage(page) {
        if (page >= 0) {
            this._paging = true;
            this.page = Math.round(page);
            // # - Page set but Max Results isn't
            if (this.maxResults == 0) {
                this.maxResults = TableDataQuery.MAX_RESULTS_DEFAULT;
            }
        }
        else {
            this._paging = false;
        }
        return this;
    }
    getSQL() {
        return __awaiter(this, void 0, void 0, function* () {
            let values = [];
            // SELECT FROM
            let sql = "SELECT " + (yield this.generateColumnsSQL());
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
            '';
            if (this.table.getName() != "Auria.Object") {
                sql += "LEFT JOIN `object` as obj ON "
                    + "`obj`.`table_id` = `" + this.table.table + "`.`" + this.table.distinctiveColumn + "`"
                    + "AND `obj`.`table` = '" + this.table.table + "' ";
            }
            // # - WHERE
            let condition = "";
            let conditionsSQL = [];
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
                let limit = "LIMIT " + this.maxResults + " "
                    + (this.page > 0 ? " OFFSET " + this.page : "");
                sql += limit;
            }
            return {
                sql: sql,
                values: values
            };
        });
    }
    /**
     * Return all the columns as a string separated by comma
     */
    generateColumnsSQL() {
        return __awaiter(this, void 0, void 0, function* () {
            let columnsArr = yield this.getTableColumns(this.columns);
            let strArr = [];
            columnsArr.forEach((col) => {
                strArr.push("`" + this.table.table + "`.`" + col.column + "`");
            });
            return strArr.join(' , ');
        });
    }
    generateOrderSQL() {
        let sql = this.order.length > 0 ? "ORDER BY " : "";
        let orders = [];
        this.order.forEach((or) => {
            orders.push(or.column + " " + or.direction);
        });
        return sql + orders.join(' , ');
    }
    getSQLString() {
        return '';
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = this.getSQL()
                .then((sql) => {
                let conn = this.system.getSystemConnection();
                return conn.query(sql.sql, sql.values);
            })
                .then((res) => {
                let models = [];
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
        });
    }
    buildRowModelFromQueryResult(id, data) {
        let nModel = new RowModel_1.RowModel(this.table, id);
        let objEq = new RowObject_1.RowObject(nModel);
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
TableDataQuery.MAX_RESULTS_DEFAULT = 20;
exports.TableDataQuery = TableDataQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVEYXRhUXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL2RhdGFRdWVyeS9UYWJsZURhdGFRdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsNkRBQTBEO0FBRTFELCtEQUE0RDtBQVk1RCxNQUFhLGNBQWM7SUErRnZCLFlBQVksTUFBYyxFQUFFLEtBQVk7UUFyRnhDOzs7Ozs7V0FNRztRQUNPLFlBQU8sR0FBa0IsRUFBRSxDQUFDO1FBRXRDOzs7Ozs7V0FNRztRQUNPLGtCQUFhLEdBQWtCLEVBQUUsQ0FBQztRQUU1Qzs7Ozs7Ozs7O1dBU0c7UUFDTyxlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRWpDOzs7Ozs7Ozs7V0FTRztRQUNPLFNBQUksR0FBVyxDQUFDLENBQUM7UUFFM0I7Ozs7Ozs7O1dBUUc7UUFDTyxZQUFPLEdBQVksS0FBSyxDQUFDO1FBVW5DOzs7OztXQUtHO1FBQ08scUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBRW5DOzs7OztXQUtHO1FBQ08sb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFXOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDdkIsQ0FBQztJQUVNLFFBQVEsQ0FBQyxJQUFnQjtRQUM1QixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSTtZQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7WUFFdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1FBRXJGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTSxVQUFV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