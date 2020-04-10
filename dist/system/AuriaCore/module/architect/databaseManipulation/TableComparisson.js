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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVDb21wYXJpc3Nvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zeXN0ZW0vQXVyaWFDb3JlL21vZHVsZS9hcmNoaXRlY3QvZGF0YWJhc2VNYW5pcHVsYXRpb24vVGFibGVDb21wYXJpc3Nvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLDZEQUErRTtBQUMvRSx1RkFBb0Y7QUFDcEYseUZBQStGO0FBSS9GLE1BQWEsZ0JBQWdCO0lBaUJ6QixZQUFZLFVBQTJCO1FBUC9CLDJCQUFzQixHQUcxQixFQUFFLENBQUM7UUFLSCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksYUFBYSxDQUFDLEtBQVk7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLDhCQUE4QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSSxrQkFBa0IsQ0FBQyxLQUFhO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNXLDhCQUE4QixDQUFDLEtBQVk7O1lBQ3JELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLO2dCQUM3QixPQUFPLENBQUMsT0FBTyxFQUFFO3FCQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztxQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNULElBQUksR0FBRyxHQUFHLElBQUkscURBQXlCLEVBQUUsQ0FBQztvQkFDMUMsR0FBRyxD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