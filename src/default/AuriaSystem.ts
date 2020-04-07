import { System } from "../kernel/System";
import Knex = require("knex");
import { PasswordAutheticator } from "../kernel/security/auth/PasswordAuthenticator";
import { SystemConfig } from "./SystemConfig";
import { AuriaSystemAuthenticator } from "./security/AuriaSystemAutheticator";
import { AuriaAccessRuleFactory } from "./security/access/AuriaAccessRuleFactory";
import { SystemRequest } from "../kernel/http/request/SystemRequest";
import { UserNotLoggedIn } from "../kernel/exceptions/kernel/UserNotLoggedIn";
import { AuthenticationFailed } from "../kernel/exceptions/kernel/AuthenticationFailed";
import { SystemUser } from "../kernel/security/SystemUser";
import { Response, NextFunction } from "express-serve-static-core";
import { AccessRuleFactory } from "../kernel/security/access/AccessRuleFactory";

export class AuriaSystem extends System {


    protected getAccessRuleFactory(): AccessRuleFactory {
       
         // Define the AccessRuleFactory!
         let factoryClass = new AuriaAccessRuleFactory(this);
        
        return factoryClass.getFactoryFunction();
    }

    /**
     * Encrypter Random Password
     * --------------------------
     * 
     * A random password generated when creating a new system based on the default
     * AuriaSystem package, used to obfuscate the SystemConfig file;
     * 
     * The main purpose of the obfuscation is to prevent installed modules to gaining
     * access to your system database credentials;
     */
    // protected encrypterRandomPassword: string = "Enc#Con12figId#45nfo";

    /**
     * System Config
     * --------------
     * 
     * Load all the customizations to be used in this system
     */
    private systemConfig: typeof SystemConfig;

    protected authenticator: PasswordAutheticator;

    constructor(name: string) {
        super(name);

       

    }


    protected buildSystemConnection(): Knex<any, any[]> {
        //this.buildEncrypter();
        this.loadSystemConfiguration();

        let dbConfig = this.systemConfig.Database;

        this.connection = Knex({
            client: dbConfig.Client,
            connection: {
                server: dbConfig.Host,
                user: dbConfig.User,
                port: dbConfig.Port,
                database: dbConfig.Schema,
                password: dbConfig.Password,
            }
        });

        return this.connection;
    }

    public getSystemConnection(): Knex<any, any[]> {

        return this.connection || this.buildSystemConnection();
    }

    public getAuthenticator(): PasswordAutheticator {

        return this.authenticator || this.buildSystemAuthenticator();
    }


    private buildSystemAuthenticator(): PasswordAutheticator {

        let auth = new AuriaSystemAuthenticator(this);

        return auth;

    }

    private loadSystemConfiguration() {
        this.systemConfig = SystemConfig;

        //let encName = this.cipher.update('utf8','hex',this.name) + this.cipher.final('hex');
        /*
        @TODO Obfuscate config file in production!
        // File encrypted ?        
        if (this.systemConfig.Encrypted == encName) {
                    this.systemConfig = this.decryptConfig(this.systemConfig);
                } else {
                    //this.obfuscateConfigFile(this.systemConfig);
                }
        **/
        return this.systemConfig;

    }

    public handleRequest(req : SystemRequest, res: Response, next: NextFunction) {
        return super.handleRequest(req, res, next);
    }
    /**
     * Authenticate Request
     * --------------------
     * 
     * Check keep signed in session
     * 
     * @param request 
     */
    public async authenticateRequest(request: SystemRequest) {
        let user : SystemUser;

        try {
            user = await super.authenticateRequest(request);
        } catch (err) {
            console.log("Authenticate Request Failed: ", err);
            // If the error is UserNotLoggedIn check for saved sessions!
            if (err instanceof UserNotLoggedIn) {
                user = await this.authenticateTokenSession(request);
            }
            else
                throw err;
        }
        return user;
    }

    public authenticateTokenSession(request: SystemRequest) {

        let token = request.headers[
            PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME.toLowerCase()
        ]! as string;

        let tokenInfo = this.getAuthenticator().validateToken(token);

        if (!tokenInfo.valid) {
            throw new AuthenticationFailed("Failed to validate authentication token!");
        }

        return this.getSystemConnection()
            .select("_id")
            .from("sessions")
            .where({
                user: tokenInfo.authInfo!.username,
                machine_ip: request.getIp(),
                user_agent: request.getUserAgent(),
                token: token,
                system: request.getSystemName()
            })
            .then((res) => {
                if (res.length == 1) {
                    let nUser = new SystemUser(request.getSystem(), tokenInfo.authInfo!.username);
                    nUser.setId(tokenInfo.authInfo!.user_id);
                    request.getSystem().loginUser(nUser, request);
                    return nUser;
                }
                else
                    throw new AuthenticationFailed("Failed to validate token session!");
            });
    }



    /*
    @TODO obfuscate config file in production!
    protected obfuscateConfigFile(config: typeof SystemConfig) {
        let encrypted = this.encryptObject(config);
        console.log("AuriaSystem will now obfuscate the config object!\nConfig: ", config, "\nObfucated:", encrypted);

        return encrypted;

    }

    private encryptObject(object: any): any {

        let encryptedObj = {};
        for (const a in object) {
            if (object.hasOwProperty(a)) {
                if (typeof object[a] == "string") {
                    encryptedObj[a] = this.cipher.update('utf8', 'hex', object[a]) + this.cipher.final('hex');
                } else if (typeof object[a] == "object") {
                    encryptedObj[a] = this.encryptObject(object[a]);
                } else {
                    encryptedObj[a] = object[a];
                }
            }
        }

        return encryptedObj;
    }

    private decryptConfig(config: typeof SystemConfig): typeof SystemConfig {

        let decryptedConfig: typeof SystemConfig = Object.assign(
            {},
            (this.decryptObject(config) as typeof SystemConfig),
            {
                Encrypted: this.cipher.update('utf8', 'hex', this.name),
            });

        return decryptedConfig;
    }

    private decryptObject(obj: any): any {
        let decryptedObj = {};

        for (const a in obj) {
            if (obj.hasOwProperty(a)) {
                if (typeof obj[a] == "string") {
                    decryptedObj[a] = this.decipher.update('hex', 'utf8', obj[a]);
                } else if (typeof obj[a] == "object") {
                    decryptedObj[a] = this.decryptObject(obj[a]);
                } else {
                    decryptedObj[a] = obj[a];
                }
            }
        }

        return obj;
    }
    */

}