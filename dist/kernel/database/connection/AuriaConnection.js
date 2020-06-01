export class AuriaConnection {
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
