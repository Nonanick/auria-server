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
                .catch((err) => {
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
            throw new Error("Not implemented yet");
            /*
                    try {
            
                        let [colTable, txtResTable] = await Promise.all([
                            this.module.getTable(user, "Auria.Collumn"),
                            this.module.getTable(user, "Auria.TextResource")]
                        );
            
                        let colName = this.toCamelCase(comparisson.outOfSync!.field);
                        let colTitleKey = "@{Auria.Columns.Title." + table.getName() + "." + colName + "}";
                        let colDescriptionKey = "@{Auria.Columns.Description." + table.getName() + "." + colName + "}";
                        let dataType = this.rawTypeToDataType(comparisson.outOfSync!.type!);
            
                        // # - Create and save column
                        let col = new RowModel(colTable!);
                        col.setAttribute({
                            name: colName,
                            column: comparisson.outOfSync!.field,
                            table_name: table.table,
                            title: colTitleKey,
                            description: colDescriptionKey,
                            table_type: "physic",
                            data_type: dataType,
                            attributes: comparisson.outOfSync!.key,
                            required: 1,
                            allow_modification: 1,
                            active: 1
                        });
                        col.save(user);
            
                        // # - Create and save text resources
                        let title = new RowModel(txtResTable!);
                        title.setAttribute({
                            lang: "en",
                            variation: "us",
                            name: colTitleKey,
                            value: colName
                        });
                        title.save(user);
            
                        let description = new RowModel(txtResTable!);
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
                    }*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVNYW5hZ2VyTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2xpc3RlbmVyL1RhYmxlTWFuYWdlckxpc3RlbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnRkFBd0g7QUFReEgsdUZBQW1GO0FBRW5GLE1BQWEsb0JBQXFCLFNBQVEsK0JBQWM7SUFJcEQsWUFBWSxNQUFzQjtRQUM5QixLQUFLLENBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUE4Qm5DLGNBQVMsR0FBbUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFFNUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztpQkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNYLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsT0FBTyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDWixHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQztRQUVL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