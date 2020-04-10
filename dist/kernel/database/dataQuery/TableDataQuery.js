"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
                return conn.raw(sql.sql, sql.values);
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
exports.TableDataQuery = TableDataQuery;
TableDataQuery.MAX_RESULTS_DEFAULT = 20;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVEYXRhUXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL2RhdGFRdWVyeS9UYWJsZURhdGFRdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUlBLDZEQUEwRDtBQUUxRCwrREFBNEQ7QUFZNUQsTUFBYSxjQUFjO0lBK0Z2QixZQUFZLE1BQWMsRUFBRSxLQUFZO1FBckZ4Qzs7Ozs7O1dBTUc7UUFDTyxZQUFPLEdBQWtCLEVBQUUsQ0FBQztRQUV0Qzs7Ozs7O1dBTUc7UUFDTyxrQkFBYSxHQUFrQixFQUFFLENBQUM7UUFFNUM7Ozs7Ozs7OztXQVNHO1FBQ08sZUFBVSxHQUFXLENBQUMsQ0FBQztRQUVqQzs7Ozs7Ozs7O1dBU0c7UUFDTyxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBRTNCOzs7Ozs7OztXQVFHO1FBQ08sWUFBTyxHQUFZLEtBQUssQ0FBQztRQVVuQzs7Ozs7V0FLRztRQUNPLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUVuQzs7Ozs7V0FLRztRQUNPLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBVzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxRQUFRLENBQUMsSUFBZ0I7UUFDNUIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUk7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O1lBRXZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQztRQUVyRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ00sVUFBVSxDQUFDLE9BQXVCO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxjQUFjO1FBRWpCLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7U0FFNUI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sZUFBZTtRQUVsQixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFO1NBRTVCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDVSxVQUFVLENBQUMsR0FBRyxPQUFpQjs7WUFFeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLEdBQUcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7YUFDckI7WUFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxPQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVNLFFBQVEsQ0FBQyxLQUFpQjtRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksVUFBVSxDQUFDLEdBQUcsT0FBc0I7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxNQUFlLEVBQUUsR0FBRyxPQUFzQjtRQUN4RCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0M7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRWUsZUFBZSxDQUFDLEtBQXFCOztZQUNqRCxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBVyxDQUNoQyxPQUFpQyxFQUNqQyxNQUEwQixFQUM1QixFQUFFO2dCQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQ2pDLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRTt3QkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNyQzt5QkFBTTt3QkFDSCxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7d0JBRXhCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTs0QkFDdEIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRTtnQ0FDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBVyxDQUFDLENBQUM7NkJBQ3pDO2lDQUFNO2dDQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEdBQUcsT0FBTyxHQUFHLDRCQUE0QixDQUFDLENBQUM7NkJBQ2pHO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDakI7Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQ2IsTUFBTSxDQUFDLGdEQUFnRCxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUM7S0FBQTtJQUVNLGtCQUFrQixDQUFDLE1BQWM7UUFDcEMsSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ2IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDO2FBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO2FBQU07WUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7U0FDNUU7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksT0FBTyxDQUFDLElBQVk7UUFDdkIsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTdCLHFDQUFxQztZQUNyQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFO2dCQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQzthQUN4RDtTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFHWSxNQUFNOztZQUVmLElBQUksTUFBTSxHQUFVLEVBQUUsQ0FBQztZQUV2QixjQUFjO1lBQ2QsSUFBSSxHQUFHLEdBQUcsU0FBUyxJQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUEsQ0FBQztZQUV0RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksY0FBYyxFQUFFO2dCQUN4QyxHQUFHO29CQUNDLCtDQUErQzswQkFDN0MsMkNBQTJDOzBCQUMzQyw2Q0FBNkM7MEJBQzdDLDBDQUEwQzswQkFDMUMsOENBQThDOzBCQUM5Qyw4Q0FBOEM7MEJBQzlDLHlDQUF5QzswQkFDekMsOENBQThDOzBCQUM5QyxtREFBbUQ7MEJBQ25ELCtDQUErQyxDQUFDO2FBQ3pEO1lBRUQsR0FBRyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDMUMsRUFBRSxDQUFBO1lBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLGNBQWMsRUFBRTtnQkFDeEMsR0FBRyxJQUFJLCtCQUErQjtzQkFDaEMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsR0FBRztzQkFDdEYsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQzNEO1lBRUQsWUFBWTtZQUNaLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztZQUMzQixJQUFJLGFBQWEsR0FBYSxFQUFFLENBQUM7WUFFakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMxQixTQUFTLEdBQUcsU0FBUyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDdkQ7WUFFRCxHQUFHLElBQUksU0FBUyxDQUFDO1lBRWpCLFdBQVc7WUFDWCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkIsR0FBRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQ2xDO1lBRUQsWUFBWTtZQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxJQUFJLEtBQUssR0FDTCxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHO3NCQUM5QixDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXBELEdBQUcsSUFBSSxLQUFLLENBQUM7YUFDaEI7WUFFRCxPQUFPO2dCQUNILEdBQUcsRUFBRSxHQUFHO2dCQUNSLE1BQU0sRUFBRSxNQUFNO2FBQ2pCLENBQUM7UUFDTixDQUFDO0tBQUE7SUFFRDs7T0FFRztJQUNXLGtCQUFrQjs7WUFDNUIsSUFBSSxVQUFVLEdBQWEsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7WUFFMUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFTyxnQkFBZ0I7UUFFcEIsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRCxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUdNLFlBQVk7UUFDZixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFWSxLQUFLOztZQUVkLElBQUksT0FBTyxHQUNQLElBQUksQ0FBQyxNQUFNLEVBQUU7aUJBQ1IsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUM3QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNWLElBQUksTUFBTSxHQUFlLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDakMsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUM3QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN2QjtpQkFDSjtnQkFDRCxPQUFPLE1BQU0sQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztZQUVYLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxxREFBcUQsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RSxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUM7S0FBQTtJQUVPLDRCQUE0QixDQUFDLEVBQU8sRUFBRSxJQUFTO1FBRW5ELElBQUksTUFBTSxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxHQUFHLElBQUkscUJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsQyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ1YsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQzFCLFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1lBQ2xDLGVBQWUsRUFBRSxJQUFJLENBQUMsc0JBQXNCO1lBQzVDLFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1lBQ2xDLFNBQVMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ2hDLFNBQVMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ2hDLFlBQVksRUFBRSxJQUFJLENBQUMsbUJBQW1CO1lBQ3RDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN4QixVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtZQUNsQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUI7WUFDdEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN2QixRQUFRLEVBQUUsRUFBRTtZQUNaLFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQ3JDLENBQUMsQ0FBQztRQUVILHFDQUFxQztRQUNyQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNuQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzNCLElBQUk7b0JBQ0EsZUFBZTtvQkFDZixtQkFBbUI7b0JBQ25CLHdCQUF3QjtvQkFDeEIsbUJBQW1CO29CQUNuQixrQkFBa0I7b0JBQ2xCLGtCQUFrQjtvQkFDbEIscUJBQXFCO29CQUNyQixjQUFjO29CQUNkLG1CQUFtQjtvQkFDbkIsZ0JBQWdCO29CQUNoQixtQkFBbUI7aUJBQ3RCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUN2QjthQUNKO1NBQ0o7UUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7O0FBL1pMLHdDQWdhQztBQTlaa0Isa0NBQW1CLEdBQVcsRUFBRSxDQUFDIn0=