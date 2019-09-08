"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuriaConnection {
    constructor(driver, host, port, user, dbName) {
        this.driver = driver;
        this.host = host;
        this.port = port;
        this.user = user;
        this.dbName = dbName;
        this.errors = [];
    }
    /**
     * [Add]: Error Message
     * ------------------
     * Add an error message to this connection
     *
     * @param error
     */
    addError(error) {
        this.errors.push(error);
        return this;
    }
    /**
     * Get Driver
     * ----------
     *
     * Return this connection driver
     */
    getDriver() {
        return this.driver;
    }
}
exports.AuriaConnection = AuriaConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFDb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9jb25uZWN0aW9uL0F1cmlhQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQXNCLGVBQWU7SUErQ2pDLFlBQVksTUFBYyxFQUFFLElBQVksRUFBRSxJQUFhLEVBQUUsSUFBWSxFQUFFLE1BQWM7UUFDakYsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLFFBQVEsQ0FBQyxLQUFjO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztDQWlDSjtBQTdHRCwwQ0E2R0MifQ==