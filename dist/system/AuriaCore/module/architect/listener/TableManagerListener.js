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
const ModuleListener_1 = require("../../../../../kernel/module/ModuleListener");
const RowModel_1 = require("../../../../../kernel/database/structure/rowModel/RowModel");
const DatabaseSynchronizer_1 = require("../databaseManipulation/DatabaseSynchronizer");
class TableManagerListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "TableManagerListener");
        this.situation = (req, res) => {
            let table = req.requiredParam("table");
            let user = req.getUser();
            this.module.getTable(user, table)
                .then(tableO => {
                let dbSync = this.getDatabaseSynchronizer(1);
                return dbSync.compareAuriaTable(tableO);
            })
                .then(comparisson => {
                return comparisson.asJson();
            })
                .then(ansJson => {
                res.addToResponse(ansJson);
                res.send();
            });
        };
        this.databaseSync = (req, res) => {
            let tableName = req.requiredParam("table");
            let user = req.getUser();
            this.module
                .getTable(user, tableName)
                .then((table) => __awaiter(this, void 0, void 0, function* () {
                let conn = table.getConnection();
                yield table.buildColumns();
                return [table, yield this.fetchTableDescription(conn, table.table)];
            }))
                .then(([table, result]) => {
                result.forEach((colDescription) => {
                    let comparisson = this.compareColumnDescripion(colDescription, table);
                    this.syncComparissonWithAuria(user, table, comparisson);
                });
                res.send();
            })
                .catch(err => {
                console.error("[Architect.TableManager] Failed to fetch table from parameter!", err);
                res.error("", "User can't access this table!");
            });
        };
        this.list = (req, res) => {
            let tables = [];
            this.tables.forEach((table) => {
                tables.push(table.asJSON());
            });
            res.addToResponse({
                tables: tables
            });
            res.send();
        };
        this.dbSync = new Map();
    }
    getRequiredRequestHandlers() {
        return [];
    }
    getExposedActionsDefinition() {
        return {
            "list": {},
            "databaseSync": {},
            "situation": {},
        };
    }
    getDatabaseSynchronizer(conn) {
        if (!this.dbSync.has(conn)) {
            let sync = new DatabaseSynchronizer_1.DatabaseSychronizer(this.module.getSystem(), this.module.getSystem().getSystemConnection());
            this.dbSync.set(conn, sync);
        }
        return this.dbSync.get(conn);
    }
    syncComparissonWithAuria(user, table, comparisson) {
        switch (comparisson.status) {
            case 'new':
                this.createColumnFromComparisson(user, table, comparisson);
                break;
            case 'unsynced':
                this.syncColumnWithComparisson(user, table, comparisson);
                break;
            case 'sync':
                break;
        }
    }
    createColumnFromComparisson(user, table, comparisson) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let [colTable, txtResTable] = yield Promise.all([
                    this.module.getTable(user, "Auria.Collumn"),
                    this.module.getTable(user, "Auria.TextResource")
                ]);
                let colName = this.toCamelCase(comparisson.outOfSync.field);
                let colTitleKey = "@{Auria.Columns.Title." + table.getName() + "." + colName + "}";
                let colDescriptionKey = "@{Auria.Columns.Description." + table.getName() + "." + colName + "}";
                let dataType = this.rawTypeToDataType(comparisson.outOfSync.type);
                // # - Create and save column
                let col = new RowModel_1.RowModel(colTable);
                col.setAttribute({
                    name: colName,
                    column: comparisson.outOfSync.field,
                    table_name: table.table,
                    title: colTitleKey,
                    description: colDescriptionKey,
                    table_type: "physic",
                    data_type: dataType,
                    attributes: comparisson.outOfSync.key,
                    required: 1,
                    allow_modification: 1,
                    active: 1
                });
                col.save(user);
                // # - Create and save text resources
                let title = new RowModel_1.RowModel(txtResTable);
                title.setAttribute({
                    lang: "en",
                    variation: "us",
                    name: colTitleKey,
                    value: colName
                });
                title.save(user);
                let description = new RowModel_1.RowModel(txtResTable);
                description.setAttribute({
                    lang: "en",
                    variation: "us",
                    name: colDescriptionKey,
                    value: "Column Generated by Auria and currently does not have a description"
                });
                description.save(user);
            }
            catch (err) {
                console.error("[TableManager] Failed to create column!", err);
            }
        });
    }
    rawTypeToDataType(type) {
        let ret = "String";
        let rawTypeIndex = type.indexOf('(') >= 0 ? type.indexOf('(') : type.length;
        let rawType = type.slice(0, rawTypeIndex).toLocaleLowerCase();
        let stringDataType = [
            "varchar", "text", "char", "tintext", "longtext", "mediumtext"
        ];
        let numberDataType = [
            "tinyint", "bigint", "float", "int", "bit", "smallint", "double", "decimal"
        ];
        let timeDataType = [
            "timestamp", "datetime", "date", "time", "year"
        ];
        if (numberDataType.indexOf(rawType) >= 0) {
            ret = "Number";
        }
        if (stringDataType.indexOf(rawType) >= 0) {
            ret = "String";
        }
        if (timeDataType.indexOf(rawType) >= 0) {
            ret = "DateTime";
        }
        return ret;
    }
    toCamelCase(str, join = "") {
        let pcs = str.split(/[- _]/g);
        let upper = pcs.map(val => val.toLocaleUpperCase());
        return upper.join(join);
    }
    syncColumnWithComparisson(user, table, comparisson) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    fetchTableDescription(conn, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return conn.query("DESCRIBE `" + table + "`", []);
        });
    }
    compareColumnDescripion(description, table) {
        if (table.hasColumn(description.Field)) {
        }
        else {
            return { status: "new" };
        }
        return { status: "sync" };
    }
}
exports.TableManagerListener = TableManagerListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVNYW5hZ2VyTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2xpc3RlbmVyL1RhYmxlTWFuYWdlckxpc3RlbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRkFBd0g7QUFPeEgseUZBQXNGO0FBRXRGLHVGQUFtRjtBQUVuRixNQUFhLG9CQUFxQixTQUFRLCtCQUFjO0lBSXBELFlBQVksTUFBc0I7UUFDOUIsS0FBSyxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBOEJuQyxjQUFTLEdBQW1CLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBRTVDLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXpCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7aUJBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDWCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLE9BQU8sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ2hCLE9BQU8sV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hDLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1osR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDWCxD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