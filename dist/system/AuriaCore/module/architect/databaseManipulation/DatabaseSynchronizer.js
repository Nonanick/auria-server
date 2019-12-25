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
            .raw("SHOW TABLES")
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
            throw new Error("To be implemented"); /*
            return Promise
                .all([
                    // SHOW TABLES in database
                    this.getTablesFromConnection(),
                    // Check tables in Auria.Table
                    // @todo, filter by connection!
                    this.system.getData().listAllTables("table")
                ])
                .then(([tablesInConnection, tablesInAuria]) => {
                    let ret: string[] = [];
                    // # - Traverser Tables in Connection list
                    tablesInConnection.forEach((tIC) => {
                        // # - heck if the ARE in Auria
                        if (tablesInAuria.indexOf(tIC) >= 0) {
                            ret.push(tIC);
                        }
                    });
                    return ret;
                });*/
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
            throw new Error("To be implemented");
            /*
            return Promise
                .all([
                    // SHOW TABLES in database
                    this.getTablesFromConnection(),
                    // Check tables in Auria.Table
                    // @todo, filter by connection!
                    this.system.getData().listAllTables("table")
                ])
                .then(([tablesInConnection, tablesInAuria]) => {
                    let ret: string[] = [];
                    // # - Traverse Table in Connections list
                    tablesInConnection.forEach((tIC) => {
                        // # - Check if the are NOT in Auria
                        if (tablesInAuria.indexOf(tIC) < 0) {
                            ret.push(tIC);
                        }
                    });
                    return ret;
                });*/
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
            throw new Error("To be iplemented!"); /*
            return Promise
                .all([
                    // SHOW TABLES in database
                    this.getTablesFromConnection(),
                    // Check tables in Auria.Table
                    // @todo, filter by connection!
                    this.system.getData().listAllTables("table")
                ])
                .then(([tablesInConnection, tablesInAuria]) => {
                    let ret: string[] = [];
                    // # Traverse Tables In Auria list
                    tablesInAuria.forEach((tIA) => {
                        // # - Check if they're not present in the connection!
                        if (tablesInConnection.indexOf(tIA) < 0) {
                            ret.push(tIA);
                        }
                    });
                    return ret;
                });*/
        });
    }
    compareAuriaTable(table) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            let tableOnlyInAuria = await this.tablesOnlyInAuria();
            
            console.log("[Architect.DbSync] Tables only in Auria:", tableOnlyInAuria);
    
            let comparisson: TableComparisson = new TableComparisson(this.connection);
    
            comparisson.setAuriaTable(table);
    
            if (tableOnlyInAuria.indexOf(table.table) < 0) {
                comparisson.setConnectionTable(table.table);
            }
    
            return comparisson.compare();*/
            throw new Error("To be implemented!");
        });
    }
}
exports.DatabaseSychronizer = DatabaseSychronizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VTeW5jaHJvbml6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2RhdGFiYXNlTWFuaXB1bGF0aW9uL0RhdGFiYXNlU3luY2hyb25pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSxNQUFhLG1CQUFtQjtJQWlCNUIsWUFBWSxNQUFjLEVBQUUsVUFBZ0I7UUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ1UsdUJBQXVCOztZQUNoQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJO2dCQUM5QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUVyQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNsQyxDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDSSx5QkFBeUI7UUFDNUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxVQUFVO2FBQ25DLEdBQUcsQ0FBQyxhQUFhLENBQUM7YUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBRWIsSUFBSSxHQUFHLEdBQWEsRUFBRSxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRTtnQkFDMUIsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUU7b0JBQ2YsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNwQjtpQkFDSjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuRSxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBRVAsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNVLGFBQWE7O1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQW1CNUI7UUFDYixDQUFDO0tBQUE7SUFHRDs7Ozs7O09BTUc7SUFDVSxnQkFBZ0I7O1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQlM7UUFDYixDQUFDO0tBQUE7SUFFRDs7Ozs7O09BTUc7SUFDVSxpQkFBaUI7O1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQW1CNUI7UUFDYixDQUFDO0tBQUE7SUFFWSxpQkFBaUIsQ0FBQyxLQUFZOztZQUN2Qzs7Ozs7Ozs7Ozs7OzsyQ0FhK0I7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FBQTtDQUVKO0FBN0tELGtEQTZLQyJ9