import { MysqlConnection } from "./MysqlConnection";


export class MariaConnection extends MysqlConnection {

    constructor(host: string, port : number, user : string, dbName : string) {
        super(host,port,user,dbName);
        this.driver = "maria";
    }
    
}