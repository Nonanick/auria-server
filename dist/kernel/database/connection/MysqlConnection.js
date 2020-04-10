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
const AuriaConnection_1 = require("./AuriaConnection");
const mysql_1 = require("mysql");
class MysqlConnection extends AuriaConnection_1.AuriaConnection {
    constructor(host, port, user, dbName) {
        super("mysql", host, port, user, dbName);
    }
    connect(password) {
        this.mysqlConn = mysql_1.createConnection({
            host: this.host,
            user: this.user,
            password: password,
            database: this.dbName,
            port: this.port
        });
        this.vigentConn = this.mysqlConn;
        return true;
    }
    connectPool(password) {
        this.mysqlPool = mysql_1.createPool({
            host: this.host,
            user: this.user,
            port: this.port,
            password: password,
            database: this.dbName,
            connectionLimit: MysqlConnection.MAX_NUMBER_OF_CONNECTIONS
        });
        this.vigentConn = this.mysqlPool;
        return true;
    }
    query(query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryPromise = new Promise((resolve, reject) => {
                let queryHandler = (err, res) => {
                    if (err)
                        reject(err);
                    if (res)
                        resolve(res);
                    else
                        reject("[MysqlConnection] Error while fetching results from query");
                };
                //let q : Query = 
                this.vigentConn.query(query, values, queryHandler);
                //console.log("[SQL] New Query made: ", q.sql);
            });
            queryPromise.catch((err) => {
                console.error("[SQL Error]: Query failed", err);
            });
            return queryPromise;
        });
    }
    getConnection() {
        return this.mysqlConn;
    }
    getPool() {
        return this.mysqlPool;
    }
}
exports.MysqlConnection = MysqlConnection;
MysqlConnection.MAX_NUMBER_OF_CONNECTIONS = 10;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlzcWxDb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9jb25uZWN0aW9uL015c3FsQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHVEQUFvRDtBQUNwRCxpQ0FBc0Y7QUFFdEYsTUFBYSxlQUFnQixTQUFRLGlDQUFlO0lBa0JoRCxZQUFZLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLE1BQWM7UUFDaEUsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sT0FBTyxDQUFDLFFBQWdCO1FBRTNCLElBQUksQ0FBQyxTQUFTLEdBQUcsd0JBQWdCLENBQUM7WUFDOUIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFakMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLFdBQVcsQ0FBQyxRQUFnQjtRQUUvQixJQUFJLENBQUMsU0FBUyxHQUFHLGtCQUFVLENBQUM7WUFDeEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ3JCLGVBQWUsRUFBRSxlQUFlLENBQUMseUJBQXlCO1NBQzdELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUVqQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRVksS0FBSyxDQUFDLEtBQWEsRUFBRSxNQUFhOztZQUMzQyxJQUFJLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FDMUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ2hCLElBQUksWUFBWSxHQUFrQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtvQkFDM0MsSUFBSSxHQUFHO3dCQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFaEIsSUFBSSxHQUFHO3dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7d0JBRWIsTUFBTSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7Z0JBRTVFLENBQUMsQ0FBQztnQkFFRixrQkFBa0I7Z0JBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ25ELCtDQUErQztZQUNuRCxDQUFDLENBQ0osQ0FBQztZQUVGLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUMsRUFBRTtnQkFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sWUFBWSxDQUFDO1FBQ3hCLENBQUM7S0FBQTtJQUVNLGFBQWE7UUFDaEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFTSxPQUFPO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7O0FBdEZMLDBDQTBGQztBQXhGaUIseUNBQXlCLEdBQVcsRUFBRSxDQUFDIn0=