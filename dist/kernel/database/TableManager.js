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
const Table_1 = require("./structure/table/Table");
const ObjectRepository_1 = require("./object/ObjectRepository");
const RowModel_1 = require("./structure/rowModel/RowModel");
class TableManager {
    constructor(system) {
        this.system = system;
        this.connection = system.getSystemConnection();
        this.objectRepository = new ObjectRepository_1.ObjectRepository(system);
        RowModel_1.RowModel.objectRepository = this.objectRepository;
        this.buildTables().then((tableMap) => {
            this.tables = tableMap;
        }).catch((sqlErr) => {
            throw new Error("[Table Manager] Failed to load tables!\n" + sqlErr);
        });
    }
    // protected async buildDataTypes(): Promise<Map<string, DataType>> {
    //    // return DataTypeRepository.buildDataTypes(this.system);
    // }
    buildTables() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.buildTablesPromise != null) {
                return this.buildTablesPromise;
            }
            let promise = new Promise((resolve, reject) => {
                this.connection.select("name", "title", "description", "connection_id", "table", "descriptive_column", "distinctive_column")
                    .from("table")
                    .then((res) => {
                    let map = new Map();
                    res.forEach((tb) => {
                        let table = new Table_1.Table(this.system, tb.name);
                        table.connectionId = tb.connection_id;
                        table.table = tb.table;
                        table.title = tb.title;
                        table.descriptiveColumn = tb.descriptive_column;
                        table.description = tb.description;
                        table.distinctiveColumn = tb.distinctive_column;
                        table.buildColumns();
                        map.set(table.getName(), table);
                    });
                    resolve(map);
                }).catch((err) => {
                    reject("SQL Error: " + err.message);
                });
            });
            this.buildTablesPromise = promise;
            return promise;
        });
    }
    getTables() {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.tables == null) {
                    resolve(yield this.buildTables());
                }
                else {
                    resolve(this.tables);
                }
            }));
            return promise;
        });
    }
    getTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            let t = null;
            try {
                let tables = yield this.getTables();
                t = tables.get(table);
            }
            catch (err) {
                console.error("[Table Manager] Failed to load table with name: ", table, "\n", err);
            }
            if (t == null) {
                throw new Error("[TableManager] Table does not exists '" + table + "'");
            }
            return t;
        });
    }
}
exports.TableManager = TableManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9UYWJsZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLG1EQUFnRDtBQUVoRCxnRUFBNkQ7QUFDN0QsNERBQXlEO0FBR3pELE1BQWEsWUFBWTtJQXlDckIsWUFBWSxNQUFjO1FBRXRCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFL0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsbUJBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFFbEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FDbkIsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNULElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDekUsQ0FBQyxDQUFDLENBQUM7SUFHWCxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLCtEQUErRDtJQUMvRCxJQUFJO0lBRVksV0FBVzs7WUFDdkIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzthQUNsQztZQUVELElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUNyQixDQUNJLE9BQTRDLEVBQzVDLE1BQTZCLEVBQy9CLEVBQUU7Z0JBQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8s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