import { Response, NextFunction } from "express-serve-static-core";
import { EventEmitter } from 'events';
// Default system modules
import { Authenticator, ServerResponse, BootSequence } from "aurialib2";
// Params config import

// Exceptions
import { UnauthorizedAccess } from "./exceptions/kernel/UnauthorizedAccess.js";
import Knex from "knex";
import { SystemUser } from "./security/user/SystemUser.js";
import { ModuleManager } from "./module/ModuleManager.js";
import { ServerDataSteward } from "./database/dataSteward/ServerDataSteward.js";
import { AccessPolicyEnforcer } from "./security/access/AccessPolicyEnforcer.js";
import { ResourceManager } from "./resource/ResourceManager.js";
import { ConnectionManager } from "./connection/ConnectionManager.js";
import { SystemRequestFactory, SystemRequest } from "./http/request/SystemRequest.js";
import { SystemModule } from "./module/SystemModule/SystemModule.js";
import { Module } from "./module/Module.js";
import { SystemAuthenticator } from "./security/auth/SystemAuthenticator.js";
import { UserNotLoggedIn } from "./exceptions/kernel/UserNotLoggedIn.js";
import { ModuleUnavaliable } from "./exceptions/kernel/ModuleUnavaliable.js";
import { ModuleRequestFactory } from "./http/request/ModuleRequest.js";
import { AuriaException } from "./exceptions/AuriaException.js";
import { ServerRequest } from "./http/request/ServerRequest.js";
import { RequestStack } from "./RequestStack.js";
import { AccessRuleFactory } from "./security/access/AccessRuleFactory.js";
import { Auria_ENV } from "../AuriaServer.js";
export const DEFAULT_LANG = "en";
export const DEFAULT_LANG_VARIATION = "us";

export abstract class System extends EventEmitter {

    public static EVENT_SYSTEM_MODULE_ADDED = "SystemModuleAdded";

    public static EVENT_SYSTEM_RESOURCE_MODIFIED = "SystemResourceModified";

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

    protected boot: BootSequence;

    /**
     * System connection
     * ------------------
     */
    protected connection: Knex;

    /**
     * System Authenticator
     * ---------------------
     * 
     * Shall parse authentication from the HTTP requests and validate them
     * Generating credentials and/or JWTokens is the responsability of the 
     * System Module > Login Listener!
     * 
     * Authenticator only validates the HTTP credentials and associates them to a
     * user!
     */
    protected authenticator: Authenticator;

    /**
     * Data Steward
     * -------------
     * 
     * DataSteward is the gateway to accessing and modifying information
     * on the database!
     */
    protected dataSteward: ServerDataSteward;

    /**
     * Access Policy Enforcer
     * ----------------------
     * 
     * Checks if the user have permission to access the requested action!
     * 
     * Each "<ListenerAction>" have its own "<AccessPolicy>" determined by their 
     * <ModuleListener> AccessPolicyEnforcer Traverse through each module gathering
     * all of this Access Policies and applies them in each Request!
     */
    protected accessPolicyEnforcer: AccessPolicyEnforcer;

    protected resourceManager: ResourceManager;

    protected connectionManager: ConnectionManager;

    /**
        * Module manager
        * 
        * Hold all the modules from this system merging database parameters
        * with coded parts of the module
        */
    protected moduleManager: ModuleManager;

    /**
     * Translations
     * ------------
     * 
     * Hold all the loaded translations from this server
     * (Should be here?)
     */
    protected loadedTranslations: {
        [langVariation: string]: any
    } = {};

    /**
     * [Factory] SystemRequest
     * ------------------------
     * 
     * Factory to produce a <SystemRequest> Object
     * A SystemRequest is an extension of the express <Request> Object
     * 
     * The factory shall add functions and variables that is AVALIABLE TO ALL
     * LEVES OF THE REQUEST ( System > Module > Listener > Action );
     * 
     */
    protected systemRequestFactory: SystemRequestFactory;

    constructor(name: string) {
        super();

        console.info("[System] Creating new system: ", name);
        this.name = name;

        this.boot = new BootSequence();
        this.users = new Map();

        this.systemRequestFactory = new SystemRequestFactory();

        this.resourceManager = new ResourceManager(this);
        this.moduleManager = new ModuleManager(this);
        this.connectionManager = new ConnectionManager(this);
        this.dataSteward = new ServerDataSteward(this.resourceManager);
        this.accessPolicyEnforcer = new AccessPolicyEnforcer(this);

        this.accessPolicyEnforcer.setAccessRuleFactory(this.getAccessRuleFactory());

        this.boot.addBootable("ConnectionBoot", this.connectionManager);
        this.boot.addBootable("ResourceBoot", this.resourceManager, { 
            dependencies: ["ConnectionBoot"] 
        });
        this.boot.addBootable("ModuleBoot", this.moduleManager, {
            dependencies: ["ResourceBoot"]
        });

        // If ENV == "development", systemversion does not change!
        this.systemVersion = Auria_ENV == "development" ?
            1 : Math.round(Math.random() * 1000000);

        console.log("[System] Initializing modules from system ", name);

        this.boot.initialize();

        this.addModule(
            // # - System related functions
            new SystemModule(this)
        );
    }

    /**
     * Public access to this system modules instances
     */
    public getSystemModules(): Map<string, Module> {
        let modules: Map<string, Module> = new Map();

        this.moduleManager.getAllModules().forEach((mod) => {
            modules.set(mod.name, mod);
        });

        return modules;
    }

    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): Knex;

    /**
     * Public access to this system database connection
     */
    public abstract getSystemConnection(): Knex;

    /**
     * Public access to this system authenticator
     */
    public abstract getAuthenticator(): SystemAuthenticator;

    /**
     * Public access to this system data steward
     */
    public getDataSteward(): ServerDataSteward {
        return this.dataSteward;
    }

    /**
     * Login User 
     * -----------
     * 
     * Register an user as "logged in" in this system!
     * 
     * -- Alias to 'addUser' --
     * @param user 
     * @param request 
     */
    public loginUser(user: SystemUser, request: SystemRequest): System {
        return this.addUser(user, request);
    }

    /**
     * Add User
     * ---------
     * 
     * Adds an user to this system, the user will be considered "logged in" and
     * future requests with a valid authentication attached to this user will be
     * accepted 
     * 
     * @param user To user to be added 
     * @param request The request to this user be logged in
     * 
     */
    public addUser(user: SystemUser, request: SystemRequest): System {

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

    /**
     * Add Module
     * ------------
     * Add a Module to this system!
     * 
     * @param modules 
     */
    public addModule(...modules: Module[]) {
        modules.forEach((mod) => {
            this.moduleManager.addModule(mod);
            this.emit(System.EVENT_SYSTEM_MODULE_ADDED, mod);
        });
    }

    public getModule(moduleName: string) {
        return this.moduleManager.getModule(moduleName);
    }

    public getAllModules(): Module[] {
        return this.moduleManager.getAllModules();
    }

    public getConnectionManager(): ConnectionManager {
        return this.connectionManager;
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
        let user: SystemUser;

        try {
            user = await this.authenticateRequest(request);
        } catch (err) {
            console.log("FAILED TO AUTHENTICATE: ", err, err instanceof UserNotLoggedIn);
            user = new SystemUser(this, SystemUser.GUEST_USERNAME);
        }

        console.log("[Request] Checking user permission!");
        let authorized = await this.accessPolicyEnforcer.authorize(user, request);

        if (!authorized) {
            throw new UnauthorizedAccess("The current user is not elegible to access this resource!");
        }

        let requestedModule = request.getRequestStack().module();

        if (!this.moduleManager.hasModule(requestedModule)) {
            throw new ModuleUnavaliable("The requested module does not exist in this system!");
        }

        let module: Module = this.moduleManager.getModule(requestedModule)!;
        let moduleRequest = ModuleRequestFactory.make(request, user, module);

        let requestResponse = module.handleRequest(moduleRequest, response);
        let resp = await this.systemResponseFactory(requestResponse, response);

        response.send(resp);
        return resp;

    }

    /**
     * System Response Factory
     * ------------------------
     * 
     * Sanitize the action output response
     * Usefull to create a standart response to request
     * 
     * @param data 
     * @param response 
     */
    public async systemResponseFactory(data: any, response: Response): Promise<ServerResponse> {

        /**
         * HTTP Response should be handled by the system itself and not the server!
         * 
         * Server is just a container for systems, an entrypoint
         */
        if (data instanceof Promise) {
            return data
                .then((ans: any) => {
                    console.log("[Server] Response to request: ", ans);
                    let srvResponse: ServerResponse = {
                        digest: "ok",
                        error: "",
                        exitCode: "SYSTEM.REQUEST.FINISHED",
                        response: ans
                    };
                    return srvResponse;
                }).catch((err) => {
                    let exc = err as AuriaException;
                    return this.handleRequestException(exc, response);
                });
        } else {
            console.log("[Server] Response to request: ", data);
            let srvResponse: ServerResponse = {
                digest: "ok",
                error: "",
                exitCode: "SYSTEM.REQUEST.FINISHED",
                response: data
            };
            return srvResponse;
        }
    }

    /**
     * Handle Request Exception
     * -------------------------
     * 
     * How an Request Exception should be treated!
     * 
     * Notice that are 2 types of "Exceptions"! 
     * One occurs from flaws in the code (dividing by zero, accessing null object) 
     * others are exceptions in the flow of the request caused by lack of permission
     * or trying to perform unauthorized changes in the system!
     *  
     * @param exception 
     * @param response 
     */
    protected handleRequestException(exception: AuriaException, response: Response): ServerResponse {

        console.error("[Server] Failed to proccess request!", exception);

        response.status(exception.getHttpCode());

        let sendArgs: ServerResponse = {
            digest: "error",
            exitCode: exception.getCode(),
            error: exception.getCode(),
            response: exception.getMessage()
        };

        return sendArgs;
    }

    /**
     * Authenticate Request
     * ---------------------
     * 
     * Validate the credentials in the request
     * @param request 
     */
    public async authenticateRequest(request: SystemRequest) {
        return this.getAuthenticator().authenticateRequest(request);
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

    /**
     * Access Rule Factory
     * --------------------
     * 
     * An Access Rule Factory will transform the AccessRules exposed by the ModuleListeners
     * in actual AccessRule Objects! 
     */
    protected abstract getAccessRuleFactory(): AccessRuleFactory;

}