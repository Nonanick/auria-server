"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MysqlConnection_1 = require("./MysqlConnection");
class MariaConnection extends MysqlConnection_1.MysqlConnection {
    constructor(host, port, user, dbName) {
        super(host, port, user, dbName);
        this.driver = "maria";
    }
}
exports.MariaConnection = MariaConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFyaWFDb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9jb25uZWN0aW9uL01hcmlhQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFvRDtBQUVwRCxNQUFhLGVBQWdCLFNBQVEsaUNBQWU7SUFFaEQsWUFBWSxJQUFZLEVBQUUsSUFBYSxFQUFFLElBQWEsRUFBRSxNQUFlO1FBQ25FLEtBQUssQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0NBRUo7QUFQRCwwQ0FPQyJ9