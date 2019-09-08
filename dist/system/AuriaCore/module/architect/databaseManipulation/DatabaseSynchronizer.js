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
const TableComparisson_1 = require("./TableComparisson");
class DatabaseSychronizer {
    constructor(system, connection) {
        this.system = system;
        this.connection = connection;
    }
    /**
     * Get Tables From Connection
     * --------------------------
     *
     * Return the Promise result of the "SHOW TABLES" query
     */
    getTablesFromConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.showTablesPromise == null)
                this.renewTablesFromConnection();
            return this.showTablesPromise;
        });
    }
    /**
     * [Renew] Tables From Connection
     * -------------------------------
     *
     * Perform a new "SHOW TABLES" query in the current database
     * the query result is cached in the promise
     */
    renewTablesFromConnection() {
        this.showTablesPromise = this.connection
            .query("SHOW TABLES", [])
            .then(tableRes => {
            let ret = [];
            tableRes.forEach((tab) => {
                for (var c in tab) {
                    if (tab.hasOwnProperty(c)) {
                        ret.push(tab[c]);
                    }
                }
            });
            console.log("[DatabaseSynchronizer] Tables in Connections: ", ret);
            return ret;
        });
        return this.showTablesPromise;
    }
    /**
     * Tables in Auria
     * ---------------
     *
     * Check which tables from the database are already present in
     * Auria;
     */
    tablesInAuria() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise
                .all([
                // SHOW TABLES in database
                this.getTablesFromConnection(),
                // Check tables in Auria.Table
                // @todo, filter by connection!
                this.system.getData().listAllTables("table")
            ])
                .then(([tablesInConnection, tablesInAuria]) => {
                let ret = [];
                // # - Traverser Tables in Connection list
                tablesInConnection.forEach((tIC) => {
                    // # - heck if the ARE in Auria
                    if (tablesInAuria.indexOf(tIC) >= 0) {
                        ret.push(tIC);
                    }
                });
                return ret;
            });
        });
    }
    /**
     * Tables NOT in Auria
     * --------------------
     *
     * Check which tables are in the database and are not imported
     * to the Auria System
     */
    tablesNotInAuria() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise
                .all([
                // SHOW TABLES in database
                this.getTablesFromConnection(),
                // Check tables in Auria.Table
                // @todo, filter by connection!
                this.system.getData().listAllTables("table")
            ])
                .then(([tablesInConnection, tablesInAuria]) => {
                let ret = [];
                // # - Traverse Table in Connections list
                tablesInConnection.forEach((tIC) => {
                    // # - Check if the are NOT in Auria
                    if (tablesInAuria.indexOf(tIC) < 0) {
                        ret.push(tIC);
                    }
                });
                return ret;
            });
        });
    }
    /**
     * Tables ONLY in Auria
     * --------------------
     *
     * Check which table definitions are present in Auria and does not have
     * a counterpart in the database;
     */
    tablesOnlyInAuria() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise
                .all([
                // SHOW TABLES in database
                this.getTablesFromConnection(),
                // Check tables in Auria.Table
                // @todo, filter by connection!
                this.system.getData().listAllTables("table")
            ])
                .then(([tablesInConnection, tablesInAuria]) => {
                let ret = [];
                // # Traverse Tables In Auria list
                tablesInAuria.forEach((tIA) => {
                    // # - Check if they're not present in the connection!
                    if (tablesInConnection.indexOf(tIA) < 0) {
                        ret.push(tIA);
                    }
                });
                return ret;
            });
        });
    }
    compareAuriaTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            let tableOnlyInAuria = yield this.tablesOnlyInAuria();
            console.log("[Architect.DbSync] Tables only in Auria:", tableOnlyInAuria);
            let comparisson = new TableComparisson_1.TableComparisson(this.connection);
            comparisson.setAuriaTable(table);
            if (tableOnlyInAuria.indexOf(table.table) < 0) {
                comparisson.setConnectionTable(table.table);
            }
            return comparisson.compare();
        });
    }
}
exports.DatabaseSychronizer = DatabaseSychronizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VTeW5jaHJvbml6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2RhdGFiYXNlTWFuaXB1bGF0aW9uL0RhdGFiYXNlU3luY2hyb25pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQSx5REFBc0Q7QUFJdEQsTUFBYSxtQkFBbUI7SUFpQjVCLFlBQVksTUFBYyxFQUFFLFVBQTJCO1FBQ25ELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNVLHVCQUF1Qjs7WUFDaEMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSTtnQkFDOUIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFFckMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbEMsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0kseUJBQXlCO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVTthQUNuQyxLQUFLLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQzthQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFFYixJQUFJLEdBQUcsR0FBYSxFQUFFLENBQUM7WUFDdkIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO2dCQUMxQixLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRTtvQkFDZixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3BCO2lCQUNKO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMs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