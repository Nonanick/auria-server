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
                this.connection.query("SELECT \
                        name, title, description, connection_id, `table`, descriptive_column, distinctive_column \
                        FROM `table`", []).then((res) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9UYWJsZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLG1EQUFnRDtBQUVoRCxnRUFBNkQ7QUFFN0QsNERBQXlEO0FBRXpELE1BQWEsWUFBWTtJQXlDckIsWUFBWSxNQUFjO1FBRXRCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFL0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsbUJBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFFbEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FDbkIsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNULElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDekUsQ0FBQyxDQUFDLENBQUM7SUFHWCxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLCtEQUErRDtJQUMvRCxJQUFJO0lBRVksV0FBVzs7WUFDdkIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQzthQUNsQztZQUVELElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUNyQixDQUNJLE9BQTRDLEVBQzVDLE1BQTZCLEVBQy9CLEVBQUU7Z0JBQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQ2pCOztxQ0FFaUIsRUFDakIs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