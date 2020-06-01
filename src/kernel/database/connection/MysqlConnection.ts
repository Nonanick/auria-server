
import { Connection, Pool, createConnection, createPool, queryCallback } from "mysql";
import { AuriaConnection } from "./AuriaConnection.js";

export class MysqlConnection extends AuriaConnection {

    public static MAX_NUMBER_OF_CONNECTIONS: number = 10;

    /**
     * Mysql Connection
     * ----------------
     * 
     */
    private mysqlConn: Connection;

    /**
     * Mysql Pool connection
     */
    private mysqlPool: Pool;

    private vigentConn: Connection | Pool;

    constructor(host: string, port: number, user: string, dbName: string) {
        super("mysql", host, port, user, dbName);
    }

    public connect(password: string): boolean {

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

    public connectPool(password: string): boolean {

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

    public async query(query: string, values: any[]): Promise<any> {
        let queryPromise = new Promise<any>(
            (resolve, reject) => {
                let queryHandler: queryCallback = (err, res) => {
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
            }
        );

        queryPromise.catch((err)=> {
            console.error("[SQL Error]: Query failed", err);
        });

        return queryPromise;
    }

    public getConnection(): Connection {
        return this.mysqlConn;
    }

    public getPool(): Pool {
        return this.mysqlPool;
    }



}