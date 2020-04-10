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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VTeW5jaHJvbml6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2RhdGFiYXNlTWFuaXB1bGF0aW9uL0RhdGFiYXNlU3luY2hyb25pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBS0EsTUFBYSxtQkFBbUI7SUFpQjVCLFlBQVksTUFBYyxFQUFFLFVBQWdCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNVLHVCQUF1Qjs7WUFDaEMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSTtnQkFDOUIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFFckMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbEMsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0kseUJBQXlCO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVTthQUNuQyxHQUFHLENBQUMsYUFBYSxDQUFDO2FBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUViLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztZQUN2QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBQzFCLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFO29CQUNmLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEI7aUJBQ0o7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkUsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUVQLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2xDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDVSxhQUFhOztZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQjVCO1FBQ2IsQ0FBQztLQUFBO0lBR0Q7Ozs7OztPQU1HO0lBQ1UsZ0JBQWdCOztZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDckM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBbUJTO1FBQ2IsQ0FBQztLQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ1UsaUJBQWlCOztZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQjVCO1FBQ2IsQ0FBQztLQUFBO0lBRVksaUJBQWlCLENBQUMsS0FBWTs7WUFDdkM7Ozs7Ozs7Ozs7Ozs7MkNBYStCO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMxQyxDQUFDO0tBQUE7Q0FFSjtBQTdLRCxrREE2S0MifQ==