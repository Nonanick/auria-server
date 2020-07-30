import { MysqlConnection } from "./MysqlConnection";
export class MariaConnection extends MysqlConnection {
    constructor(host, port, user, dbName) {
        super(host, port, user, dbName);
        this.driver = "maria";
    }
}
//# sourceMappingURL=MariaConnection.js.map