import Knex = require("knex");
import { SystemConfig } from "./SystemConfig";
import { AuriaSystemAuthenticator } from "./security/AuriaSystemAutheticator";
import { AuriaAccessRuleFactory } from "./security/access/AuriaAccessRuleFactory";
import { Response, NextFunction } from "express-serve-static-core";
import { AuriaDataSteward } from "./data/AuriaDataSteward";
import { AuriaDataReader } from "./data/provider/AuriaDataReader";
import { AuriaDataWriter } from "./data/writer/AuriaDataWriter";
import { System, AccessRuleFactory, SystemRequest, PasswordAutheticator, UserNotLoggedIn, SystemUser, AuthenticationFailed} from '../kernel/AuriaKernel';

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

    public getDataSteward(): AuriaDataSteward {
        return this.dataSteward || this.buildSystemDataSteward();
    }

    private buildSystemDataSteward(): AuriaDataSteward {

        const newSteward = new AuriaDataSteward();

        const dataProvider = new AuriaDataReader();
        const dataWriter = new AuriaDataWriter();

        newSteward.setProvider(dataProvider);
        newSteward.setWriter(dataWriter);

        //For now prevent modifying the writer/provider
        newSteward
            .lockProvider()
            .lockWriter();

        return this.dataSteward;
    }


    private loadSystemConfiguration() {
        this.systemConfig = SystemConfig;

        return this.systemConfig;

    }

    public handleRequest(req: SystemRequest, res: Response, next: NextFunction) {
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
        let user: SystemUser;

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

        let sessionConsult = this.getSystemConnection()
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

        sessionConsult.catch(
            (err) => {
                console.error("[AuriaSystem] Failed to query Sessions table looking for validation token!", err);
                throw err;
            });

        return sessionConsult;
    }

}