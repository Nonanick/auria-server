import { MysqlConnection } from "./MysqlConnection";
export declare class MariaConnection extends MysqlConnection {
    constructor(host: string, port: number, user: string, dbName: string);
}
