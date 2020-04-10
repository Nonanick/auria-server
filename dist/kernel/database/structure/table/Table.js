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
                    conn
                        .select("_id as id", "name", "column", "title", "description", "data_type", "attributes", "table_type", "sql_type", "extra", "length", "default_value")
                        .from("columns")
                        .where("table_name", this.name)
                        .andWhere("active", 1)
                        .then((res) => {
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
        //return this.system.translate(langVar, this.title);
    }
    getDescription(langVar = System_1.DEFAULT_LANG) {
        //return this.system.translate(langVar, this.description);
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
            /*if (this._models.has(key)) {
                console.log("[Table] Build model already has key ", key, " Model ", this._models.get(key));
                return this._models.get(key) as RowModel;
            }*/
            let promise = new Promise((resolve, reject) => {
                let q = this.newQuery().addFilters(false, new QueryFilter_1.QueryFilter().set(this.distinctiveColumn, "=", key));
                q.fetch().then((rows) => __awaiter(this, void 0, void 0, function* () {
                    console.log("[Table] Found rows: ", rows.length, yield q.getSQL());
                    if (rows.length == 1) {
                        /* this._models.set(key, rows[0]);*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS90YWJsZS9UYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGtEQUErQztBQUMvQyw2Q0FBMEM7QUFDMUMsNENBQXVEO0FBRXZELG1FQUFnRTtBQUdoRSxtREFBZ0Q7QUFDaEQsNkRBQTBEO0FBSTFELE1BQWEsS0FBTSxTQUFRLDJCQUFZO0lBZ0huQyxZQUFZLE1BQWMsRUFBRSxJQUFZO1FBQ3BDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQVBYLGNBQVMsR0FFWixFQUFFLENBQUM7UUFNSCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVZLFVBQVU7O1lBQ25CLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDNUM7WUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQztLQUFBO0lBRVksWUFBWTs7WUFDckIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxFQUFFO2dCQUNsQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxPQUFPLENBQ2xDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUVoQixJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztvQkFDckMsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO29CQUVuRCxJQUFJO3lCQUNDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBYSxF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