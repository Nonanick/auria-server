import { Connection, Pool } from "mysql";
import { AuriaConnection } from "./AuriaConnection.js";
export declare class MysqlConnection extends AuriaConnection {
    static MAX_NUMBER_OF_CONNECTIONS: number;
    /**
     * Mysql Connection
     * ----------------
     *
     */
    private mysqlConn;
    /**
     * Mysql Pool connection
     */
    private mysqlPool;
    private vigentConn;
    constructor(host: string, port: number, user: string, dbName: string);
    connect(password: string): boolean;
    connectPool(password: string): boolean;
    query(query: string, values: any[]): Promise<any>;
    getConnection(): Connection;
    getPool(): Pool;
}
