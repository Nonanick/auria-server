export abstract class AuriaConnection {

    /**
     * Errors
     * ------
     * 
     * String of error that ocurred in this connection
     */
    protected errors : string[];

    /**
     * Driver that is being used in this connection
     */
    protected driver: string;

    /**
     * Host
     * -----
     * 
     * Database server host
     */
    protected host: string;

    /**
     * User
     * ------
     * 
     * User that will be used to authenticate
     */
    protected user: string;

    /**
     * DB Name
     * --------
     * 
     * Name of the database that will be used in this connection
     */
    protected dbName: string;

    /**
     * Port
     * -----
     * 
     * Port to connect to the server
     */
    protected port : number;

    constructor(driver: string, host: string, port : number, user: string, dbName: string) {
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
    public addError(error : string) : AuriaConnection {
        this.errors.push(error);
        return this;
    }

    /**
     * Get Driver
     * ----------
     * 
     * Return this connection driver
     */
    public getDriver() : string {
        return this.driver;
    }

    /**
     * Connect
     * -------
     * 
     * Create a single connection to the database
     * 
     * @param password password to connect to the database
     */
    public abstract connect(password: string): boolean;

    /**
     * Connect Pool
     * -------------
     * 
     * Create a pool of connections that will be open on demand
     * 
     * @param password password to connect to the database
     */
    public abstract connectPool(password: string): boolean;

    /**
     * Query
     * ------
     * 
     * Executes a query in the connection, the query is formatted as in MySQL
     * Obeying the MySQL/MariaDB Syntax
     * @param query String containing the query to be used
     * @param values Values to be replaced in the query string 
     */
    public abstract query(query : string, values : any[]) : Promise<any>;
    
}