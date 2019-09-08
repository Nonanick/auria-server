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
MysqlConnection.MAX_NUMBER_OF_CONNECTIONS = 10;
exports.MysqlConnection = MysqlConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlzcWxDb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9jb25uZWN0aW9uL015c3FsQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdURBQW9EO0FBQ3BELGlDQUFzRjtBQUV0RixNQUFhLGVBQWdCLFNBQVEsaUNBQWU7SUFrQmhELFlBQVksSUFBWSxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsTUFBYztRQUNoRSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxPQUFPLENBQUMsUUFBZ0I7UUFFM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBZ0IsQ0FBQztZQUM5QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2xCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUVqQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sV0FBVyxDQUFDLFFBQWdCO1FBRS9CLElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQVUsQ0FBQztZQUN4QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDckIsZUFBZSxFQUFFLGVBQWUsQ0FBQyx5QkFBeUI7U0FDN0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRWpDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFWSxLQUFLLENBQUMsS0FBYSxFQUFFLE1BQWE7O1lBQzNDLElBQUksWUFBWSxHQUFHLElBQUksT0FBTyxDQUMxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsSUFBSSxZQUFZLEdBQWtCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO29CQUMzQyxJQUFJLEdBQUc7d0JBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUVoQixJQUFJLEdBQUc7d0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzt3QkFFYixNQUFNLENBQUMsMkRBQTJELENBQUMsQ0FBQztnQkFFNUUsQ0FBQyxDQUFDO2dCQUVGLGtCQUFrQjtnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDbkQsK0NBQStDO1lBQ25ELENBQUMsQ0FDSixDQUFDO1lBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBQyxFQUFFO2dCQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxZQUFZLENBQUM7UUFDeEIsQ0FBQztLQUFBO0lBRU0sYUFBYTtRQUNoQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVNLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQzs7QUFwRmEseUNBQXlCLEdBQVcsRUFBRSxDQUFDO0FBRnpELDBDQTBGQyJ9