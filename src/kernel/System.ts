import { Response, NextFunction } from "express-serve-static-core";

import { SystemRequest, SystemRequestFactory } from "./http/request/SystemRequest";
import { SystemAuthenticator } from "./security/auth/SystemAuthenticator";
import { ModuleManager } from "./module/ModuleManager";
import { Module } from "./module/Module";
import { ModuleRequestFactory } from "./http/request/ModuleRequest";
import { RequestStack } from "./RequestStack";

// Default system modules
import { AuthModule } from "./module/AuthModule/AuthModule";
import { SystemModule } from "./module/SystemModule/SystemModule";

import { SystemUser } from "./security/SystemUser";
import { DataSteward } from "aurialib2";
import knex from 'knex';

// Params config import
import { Auria_ENV } from "../AuriaServer";
// Exceptions
import { ModuleUnavaliable } from "./exceptions/kernel/ModuleUnavaliable";
import { ServerRequest } from "./http/request/ServerRequest";
import { LoginRequest } from "./module/SystemModule/requests/LoginRequest";

export const DEFAULT_LANG = "en";
export const DEFAULT_LANG_VARIATION = "us";

export abstract class System {

    /**
     * System name
     * Unique identifier of this system
     */
    public name: string;

    /**
     * All System users that made contact with the server
     */
    protected users: Map<string, SystemUser>;

    /**
     * System 'version', generated each time the server is started
     * preventing old clients from connecting with new server instances
     * 
     */
    protected systemVersion: number;


    /**
     * Module manager
     * 
     * Hold all the modules from this system merging database parameters
     * with coded parts of the module
     */
    protected moduleManager: ModuleManager;

    /**
     * System connection
     * ------------------
     * 
     */
    protected connection: knex;

    /**
     * Data Steward
     * -------------
     * 
     */
    protected dataSteward: DataSteward;

    /**
     * Translations
     * ------------
     * 
     * Hold all the loaded translations from this server
     */
    protected loadedTranslations: {
        [langVariation: string]: any
    } = {};

    /**
     * [Factory] SystemRequest
     * ------------------------
     * 
     * Factory to produce the expected SystemRequest
     * 
     */
    protected systemRequestFactory: SystemRequestFactory;

    constructor(name: string) {
        this.name = name;
        this.systemRequestFactory = new SystemRequestFactory();

        console.log("[System] Creating new system: ", name);

        this.moduleManager = new ModuleManager(this);

        // If ENV == "development", systemversion does not change!
        if (Auria_ENV == "development")
            this.systemVersion = 1;
        else
            this.systemVersion = Math.round(Math.random() * 1000000);

        this.users = new Map();

        console.log("[System] Initializing modules from system ", name);

        this.addModule(
            // # - Authentication Module
            new AuthModule(this),

            // # - System related functions Module
            new SystemModule(this)
        );
    }

    /**
     * Build all modules from this system
     * 
     * This function is called one time at server startup!
     * 
     */
    protected abstract buildSystemModules(): Map<string, Module>;

    /**
     * Public access to this system modules instances
     */
    public abstract getSystemModules(): Map<string, Module>;

    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): knex;

    /**
     * Public access to this system database connection
     */
    public abstract getSystemConnection(): knex;

    /**
     * 
     */
    public abstract getAuthenticator(): SystemAuthenticator;


    public loginUser(user : SystemUser, request : LoginRequest) : System {
        return this.addUser(user, request);
    }

    /**
     * 
     * @param user 
     * @param request 
     */
    public addUser(user: SystemUser, request : LoginRequest): System {
        
        user.startSession(request);

        this.users.set(user.getUsername(), user);
        return this;
    }

    public getSystemVersion(): number {
        return this.systemVersion;
    }

    public hasModule(moduleName: string) {
        return this.moduleManager.hasModule(moduleName);
    }

    public addModule(...module: Module[]) {
        module.forEach((mod) => {
            let translations = mod.getTranslations();

            for (var lang in translations) {
                if (translations.hasOwnProperty(lang)) {
                }
            }

            this.moduleManager.addModule(mod);
        })
    }

    public getModule(moduleName: string) {
        return this.moduleManager.getModule(moduleName);
    }

    public getAllModules(): Module[] {
        return this.moduleManager.getAllModules();
    }

    public getUser(username: string): SystemUser | null {
        if (this.users.has(username)) {
            return this.users.get(username) as SystemUser;
        } else {
            return null;
        }
    }

    public isUserLoggedIn(username: string): boolean {
        return this.users.get(username) != null;
    }

    public removeUser(username: string) {
        return this.users.delete(username);
    }

    /**
     * Handle Request
     * ---------------
     * 
     * Will proccess a SystemRequest expecting a Response to be sent or
     * a Promise<Response> 
     * The Response will be received and processed to be sent as a JSON
     * object to the client that made the original HTTP Request
     * 
     * @param request SystemRequest 
     * @param response Express **Response** object
     * @param next Express **NextFunction**
     */
    public async handleRequest(request: SystemRequest, response: Response, next: NextFunction) {

        let user: SystemUser = await this.getAuthenticator().authenticateRequest(request);
        let requestedModule = request.getRequestStack().module();

        if (!this.moduleManager.hasModule(requestedModule)) {
            throw new ModuleUnavaliable("The requested module does not exist in this system!");
        }

        let module: Module = this.moduleManager.getModule(requestedModule)!;
        let moduleRequest = ModuleRequestFactory.make(request, user, module);

        return module.handleRequest(moduleRequest, response);
    }

    /**
     * Promote to SystemRequest
     * -------------------------
     * Will transform an Express **Request** object to a **SystemRequest** object
     * 
     * @param request Express **Request** object
     * @param stack RequestStack containing the digested URL
     */
    public promoteToSystemRequest(request: ServerRequest, stack: RequestStack): SystemRequest {
        return this.systemRequestFactory.make(request, this, stack);
    }

}