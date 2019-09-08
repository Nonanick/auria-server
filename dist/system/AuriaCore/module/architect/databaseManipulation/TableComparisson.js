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
const TableCompareResult_1 = require("./TableCompareResult");
const ConnectionTableDefinition_1 = require("./definitions/ConnectionTableDefinition");
const ConnectionColumnDefinition_1 = require("./definitions/ConnectionColumnDefinition");
class TableComparisson {
    constructor(connection) {
        this.buildDefinitionPromise = {};
        this.connection = connection;
    }
    /**
     * Set Auria Table
     * ----------------
     *
     * Defines an Auria Table to be compared
     * Generates a TableDefinition, class used to intermediate
     * the sync between Auria.Table and the Database table;
     *
     * @param table AuriaTable
     */
    setAuriaTable(table) {
        this.table = table;
        this.createDefinitionFromAuriaTable(table);
        return this;
    }
    /**
     * Set Connection Table
     * --------------------
     *
     * Defines a database table t be compared
     * Generates a TableDefinition, class used to intermediate
     * the sync between Auria.Table and the Database Table;
     *
     * @param table Database Table
     */
    setConnectionTable(table) {
        this.connTable = table;
        this.createDefinitionFromDbTable(table);
        return this;
    }
    /**
     * [Create] Definition, based on Auria.Table
     * ------------------------------------------
     *
     * Generates a TableDefinition based on a Auria.Table
     *
     * @param table Auria.Table
     */
    createDefinitionFromAuriaTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            this.buildDefinitionPromise.auria =
                Promise.resolve()
                    .then(_ => table.getColumns())
                    .then(cols => {
                    let def = new ConnectionTableDefinition_1.ConnectionTableDefinition();
                    def.name = table.table;
                    let colDef = [];
                    cols.forEach((auriaCol) => {
                        colDef.push(this.buildColumnDefinitionFromAuriaColumn(auriaCol));
                    });
                    def.columns = colDef;
                    return def;
                });
            return this.buildDefinitionPromise.auria;
        });
    }
    buildColumnDefinitionFromAuriaColumn(auriaCol) {
        let def = new ConnectionColumnDefinition_1.ConnectionColumnDefinition(auriaCol.column);
        def.default = auriaCol.getDefaultValue();
        def.isPrimary = auriaCol.isPrimaryKey();
        def.length = auriaCol.getMaxLength();
        def.null = auriaCol.isNullable() ? "YES" : "NO";
        def.setExtra(auriaCol.getExtra());
        def.setSQLType(auriaCol.getRawType());
        return def;
    }
    createDefinitionFromDbTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.buildDefinitionPromise.db =
                Promise.resolve()
                    .then(_ => this.buildColumnsFromDbTable(tableName))
                    .then(cols => {
                    let def = new ConnectionTableDefinition_1.ConnectionTableDefinition();
                    def.name = tableName;
                    def.columns = cols;
                    return def;
                });
            return this.buildDefinitionPromise.db;
        });
    }
    buildColumnsFromDbTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection
                .query("DESCRIBE `" + tableName + "`", [])
                .then((res) => {
                let columns = [];
                res.forEach((colDef) => {
                    let col = this.createColumnDefinitionFromDescribeResult(colDef);
                    columns.push(col);
                });
                return columns;
            });
        });
    }
    createColumnDefinitionFromDescribeResult(describeRes) {
        let col = new ConnectionColumnDefinition_1.ConnectionColumnDefinition(describeRes.Field);
        col.setSQLType(describeRes.Type);
        col.default = describeRes.Default;
        col.setExtra(describeRes.Extra);
        col.setKey(describeRes.Key);
        col.isPrimary = describeRes.Key.toLocaleUpperCase().indexOf("PRI") >= 0;
        col.null = describeRes.Null;
        return col;
    }
    compare() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.table == null && this.connTable == null) {
                throw new Error("[TableComparisson] Nothing to compare! Both Tables definitions are empty!");
            }
            let res = new TableCompareResult_1.TableCompareResult();
            if (this.table == null || this.connTable == null) {
                res.tableSituation = this.table == null ? "onlyInConnection" : "onlyInAuria";
            }
            if (this.connTable != null && this.table != null) {
                // # - Initially considered synced
                res.tableSituation = "synced";
                // # - Load the definitions
                let aDef = yield this.buildDefinitionPromise.auria;
                let cDef = yield this.buildDefinitionPromise.db;
                console.log("[TableComparisson] Now comparing Tables:", aDef, cDef);
                // # - Load Auria Columns Definitions
                aDef.columns.forEach((c) => {
                    let cName = c.getName();
                    res.columns[cName] = { auria: c };
                });
                // # - Load Connection Columns Definitions
                cDef.columns.forEach((c) => {
                    let cName = c.getName();
                    res.columns[cName] = Object.assign({ db: c }, res.columns[cName]);
                });
                // # - Compare each column value
                for (var columnName in res.columns) {
                    if (res.columns.hasOwnProperty(columnName)) {
                        let column = res.columns[columnName];
                        let compareRes = yield this.compareColumnDefinitions(column.db, column.auria);
                        res.columns[columnName].situation = compareRes;
                        if (compareRes != "synced") {
                            res.tableSituation = "unsynced";
                        }
                    }
                }
            }
            return res;
        });
    }
    compareColumnDefinitions(dbDef, auriaDef) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("[TableComparisson] Now comparing:\n", dbDef, auriaDef);
            if (dbDef == null && auriaDef == null)
                throw new Error("[TableComparisson] Nothing to compare, both definitions are empty!");
            if (dbDef == null) {
                return "onlyInAuria";
            }
            if (auriaDef == null) {
                return "onlyInConnection";
            }
            let status = "synced";
            let auriaJson = auriaDef.asJson();
            let connJson = dbDef.asJson();
            for (var prop in auriaJson) {
                if (auriaJson.hasOwnProperty(prop)) {
                    if (auriaJson[prop] != connJson[prop]) {
                        status = "unsynced";
                    }
                }
            }
            return status;
        });
    }
}
exports.TableComparisson = TableComparisson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVDb21wYXJpc3Nvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zeXN0ZW0vQXVyaWFDb3JlL21vZHVsZS9hcmNoaXRlY3QvZGF0YWJhc2VNYW5pcHVsYXRpb24vVGFibGVDb21wYXJpc3Nvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsNkRBQStFO0FBQy9FLHVGQUFvRjtBQUNwRix5RkFBK0Y7QUFJL0YsTUFBYSxnQkFBZ0I7SUFpQnpCLFlBQVksVUFBMkI7UUFQL0IsMkJBQXNCLEdBRzFCLEVBQUUsQ0FBQztRQUtILElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSSxhQUFhLENBQUMsS0FBWTtRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsOEJBQThCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLGtCQUFrQixDQUFDLEtBQWE7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ1csOEJBQThCLENBQUMsS0FBWTs7WUFDckQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUs7Z0JBQzdCLE9BQU8sQ0FBQyxPQUFPLEVBQUU7cUJBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO3FCQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ1QsSUFBSSxHQUFHLEdBQUcsSUFBSSxxREFBeUIsRUFBRSxDQUFDO29CQUMxQyxHQUFHLENB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