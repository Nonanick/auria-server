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
const ModuleListener_1 = require("../../../../../kernel/module/ModuleListener");
const DatabaseSynchronizer_1 = require("../databaseManipulation/DatabaseSynchronizer");
class TableManagerListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "TableManagerListener");
        this.situation = (req) => {
            //let table = req.requiredParam("table");
            //let user = req.getUser();
            /*this.module.getTable(user, table)
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
                });*/
        };
        this.databaseSync = (req) => {
            //let tableName = req.requiredParam("table");
            //let user = req.getUser();
            /*this.module
                .getTable(user, tableName)
                .then(async (table: Table) => {
                    let conn = table.getConnection();
                    await table.buildColumns();
                    return [table, await this.fetchTableDescription(conn, table.table)];
                })
                .then(([table, result]) => {
                    (result as DescribeTableResult[]).forEach((colDescription) => {
                        let comparisson = this.compareColumnDescripion(colDescription, table);
                        this.syncComparissonWithAuria(user, table, comparisson);
                    });
    
                    res.send();
                })
                .catch((err: any) => {
                    console.error("[Architect.TableManager] Failed to fetch table from parameter!", err);
                    res.error("", "User can't access this table!");
                });*/
        };
        this.dbSync = new Map();
    }
    getExposedActionsMetadata() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVNYW5hZ2VyTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2xpc3RlbmVyL1RhYmxlTWFuYWdlckxpc3RlbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsZ0ZBQTZFO0FBSzdFLHVGQUFtRjtBQUduRixNQUFhLG9CQUFxQixTQUFRLCtCQUFjO0lBSXBELFlBQVksTUFBc0I7UUFDOUIsS0FBSyxDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBMkJuQyxjQUFTLEdBQW1CLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFFdkMseUNBQXlDO1lBQ3pDLDJCQUEyQjtZQUUzQjs7Ozs7Ozs7Ozs7cUJBV1M7UUFDYixDQUFDLENBQUM7UUFFSyxpQkFBWSxHQUFtQixDQUFDLEdBQUcsRUFBRSxFQUFFO1lBRTFDLDZDQUE2QztZQUM3QywyQkFBMkI7WUFFM0I7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFrQlM7UUFFYixDQUFDLENBQUM7UUFyRUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRTVCLENBQUM7SUFHTSx5QkFBeUI7UUFDNUIsT0FBTztZQUNILE1BQU0sRUFBRSxFQUFFO1lBQ1YsY0FBYyxFQUFFLEVBQUU7WUFDbEIsV0FBVyxFQUFFLEVBQUU7U0FDbEIsQ0FBQztJQUNOLENBQUM7SUFFUyx1QkFBdUIsQ0FBQyxJQUFZO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLDBDQUFtQixDQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQ2hELENBQUM7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