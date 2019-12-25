import { Response, NextFunction } from "express-serve-static-core";
import { SystemRequest, SystemRequestFactory } from "./http/request/SystemRequest";
import { SystemAuthenticator } from "./security/auth/SystemAuthenticator";
import { ModuleManager } from "./module/ModuleManager";
import { Module } from "./module/Module";
import { RequestStack } from "./RequestStack";
import { SystemUser } from "./security/SystemUser";
import { DataSteward } from "aurialib2";
import knex from 'knex';
import { ServerRequest } from "./http/request/ServerRequest";
import { LoginRequest } from "./module/SystemModule/requests/LoginRequest";
export declare const DEFAULT_LANG = "en";
export declare const DEFAULT_LANG_VARIATION = "us";
export declare abstract class System {
    /**
     * System name
     * Unique identifier of this system
     */
    name: string;
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
        [langVariation: string]: any;
    };
    /**
     * [Factory] SystemRequest
     * ------------------------
     *
     * Factory to produce the expected SystemRequest
     *
     */
    protected systemRequestFactory: SystemRequestFactory;
    constructor(name: string);
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
    abstract getSystemModules(): Map<string, Module>;
    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): knex;
    /**
     * Public access to this system database connection
     */
    abstract getSystemConnection(): knex;
    /**
     *
     */
    abstract getAuthenticator(): SystemAuthenticator;
    loginUser(user: SystemUser, request: LoginRequest): System;
    /**
     *
     * @param user
     * @param request
     */
    addUser(user: SystemUser, request: LoginRequest): System;
    getSystemVersion(): number;
    hasModule(moduleName: string): boolean;
    addModule(...module: Module[]): void;
    getModule(moduleName: string): Module | undefined;
    getAllModules(): Module[];
    getUser(username: string): SystemUser | null;
    isUserLoggedIn(username: string): boolean;
    removeUser(username: string): boolean;
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
    handleRequest(request: SystemRequest, response: Response, next: NextFunction): Promise<any>;
    /**
     * Promote to SystemRequest
     * -------------------------
     * Will transform an Express **Request** object to a **SystemRequest** object
     *
     * @param request Express **Request** object
     * @param stack RequestStack containing the digested URL
     */
    promoteToSystemRequest(request: ServerRequest, stack: RequestStack): SystemRequest;
}
