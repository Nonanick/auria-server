var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createConnection, createPool } from "mysql";
import { AuriaConnection } from "./AuriaConnection.js";
let MysqlConnection = /** @class */ (() => {
    class MysqlConnection extends AuriaConnection {
        constructor(host, port, user, dbName) {
            super("mysql", host, port, user, dbName);
        }
        connect(password) {
            this.mysqlConn = createConnection({
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
            this.mysqlPool = createPool({
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
    return MysqlConnection;
})();
export { MysqlConnection };
