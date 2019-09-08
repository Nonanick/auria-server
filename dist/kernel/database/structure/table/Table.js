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
const KernelEntity_1 = require("../KernelEntity");
const Column_1 = require("../column/Column");
const System_1 = require("../../../System");
const TableDataQuery_1 = require("../../dataQuery/TableDataQuery");
const RowModel_1 = require("../rowModel/RowModel");
const QueryFilter_1 = require("../../dataQuery/QueryFilter");
class Table extends KernelEntity_1.KernelEntity {
    constructor(system, name) {
        super(system);
        this.columnMap = {};
        this.name = name;
        this.tableActions = new Map();
    }
    getColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.columns == null) {
                this.columns = yield this.buildColumns();
            }
            return this.columns;
        });
    }
    buildColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.buildColumnsPromise == null) {
                this.buildColumnsPromise = new Promise((resolve, reject) => {
                    let cols = new Map();
                    let conn = this.system.getSystemConnection();
                    conn.query("SELECT \
                        _id as id, `name`, `column`, `title`, `description`, `data_type`, `attributes`, `table_type`, `sql_type`, `extra`, `length`, `default_value`  \
                    FROM `columns`\
                    WHERE `table_name`=? AND active=? \ ", [this.name, 1]).then((res) => {
                        res.forEach((cData) => {
                            let col = new Column_1.Column(this.system, this, cData.name);
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
        });
    }
    getTitle(langVar = System_1.DEFAULT_LANG) {
        return this.system.translate(langVar, this.title);
    }
    getDescription(langVar = System_1.DEFAULT_LANG) {
        return this.system.translate(langVar, this.description);
    }
    getName() {
        return this.name;
    }
    getSystem() {
        return this.system;
    }
    /**
     * Return a new query
     * All pre-built filters of this table should be set here!
     */
    newQuery() {
        let q = new TableDataQuery_1.TableDataQuery(this.system, this);
        //@todo read pre-built filters from database and apply
        return q;
    }
    hasColumn(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getColumn(name)) != null;
        });
    }
    /**
     *
     * @param name Name or column to be searched
     */
    getColumn(name) {
        let matchedCol = null;
        // # - Search by name
        if (this.columns.has(name)) {
            matchedCol = this.columns.get(name);
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
    asJSON() {
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
    buildAllModels() {
        if (this.buildModelsPromise == null) {
            this.buildModelsPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let q = this.newQuery();
                q.fetch()
                    .then((data) => {
                    data.forEach((data) => {
                        let model = this.buildRowModelFromData(data);
                        this.addModel(model, model.getId());
                    });
                    resolve(this.getAllModels());
                })
                    .catch((err) => {
                    reject(err);
                });
            }));
        }
        return this.buildModelsPromise;
    }
    buildRowModelFromData(data) {
        let model;
        if (this.distinctiveColumn != null) {
            model = new RowModel_1.RowModel(this, data[this.distinctiveColumn]);
        }
        else {
            model = new RowModel_1.RowModel(this);
        }
        model.setAttribute(data, false);
        return model;
    }
    buildModels() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.buildAllModels();
        });
    }
    buildModel(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._models.has(key)) {
                console.log("[Table] Build model already has key ", key, " Model ", this._models.get(key));
                return this._models.get(key);
            }
            let promise = new Promise((resolve, reject) => {
                let q = this.newQuery().addFilters(false, new QueryFilter_1.QueryFilter().set(this.distinctiveColumn, "=", key));
                q.fetch().then((rows) => __awaiter(this, void 0, void 0, function* () {
                    console.log("[Table] Found rows: ", rows.length, yield q.getSQL());
                    if (rows.length == 1) {
                        this._models.set(key, rows[0]);
                        resolve(rows[0]);
                    }
                    else {
                        console.error("[Table] Build Model failed to pinpoint using provided key:", rows);
                        reject("[Table] Key given to table did not return a single value!");
                    }
                })).catch((err) => {
                    console.error("[Table] Failed to quer table searching for key ", key, "\nError: ", err);
                    reject("[Table] Failed to fetch model with key " + key);
                });
            });
            return promise;
        });
    }
    getAllModelsFromUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
            });
            return promise;
        });
    }
    getConnection() {
        //@todo make this return th actual table connection estabilished by connection_id
        return this.system.getSystemConnection();
    }
}
exports.Table = Table;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS90YWJsZS9UYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsa0RBQStDO0FBQy9DLDZDQUEwQztBQUMxQyw0Q0FBdUQ7QUFFdkQsbUVBQWdFO0FBR2hFLG1EQUFnRDtBQUNoRCw2REFBMEQ7QUFJMUQsTUFBYSxLQUFNLFNBQVEsMkJBQVk7SUFnSG5DLFlBQVksTUFBYyxFQUFFLElBQVk7UUFDcEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBUFgsY0FBUyxHQUVaLEVBQUUsQ0FBQztRQU1ILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVTs7WUFDbkIsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUM1QztZQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDO0tBQUE7SUFFWSxZQUFZOztZQUNyQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLE9BQU8sQ0FDbEMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBRWhCLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO29CQUNyQyxJQUFJLElBQUksR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO29CQUU5RCxJQUFJLENBQUMsS0FBSyxDQUNOOzs7eURBR2lDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FB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