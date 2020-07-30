/// <reference types="node" />
import { EventEmitter } from 'events';
import { Authenticator, BootSequence, Bootable } from "aurialib2";
import Knex from "knex";
import { SystemUser } from "./security/user/SystemUser.js";
import { ModuleManager } from "./module/ModuleManager.js";
import { ServerDataSteward } from "./database/dataSteward/ServerDataSteward.js";
import { AccessPolicyEnforcer } from "./security/access/AccessPolicyEnforcer.js";
import { ResourceManager } from "./resource/ResourceManager.js";
import { ConnectionManager } from "./connection/ConnectionManager.js";
import { SystemRequestFactory, SystemRequest } from "./http/request/SystemRequest.js";
import { Module } from "./module/Module.js";
import { SystemAuthenticator } from "./security/auth/SystemAuthenticator.js";
import { ModuleRequest } from "./http/request/ModuleRequest.js";
import { AuriaException } from "./exceptions/AuriaException.js";
import { ServerRequest } from "./http/request/ServerRequest.js";
import { RequestStack } from "./RequestStack.js";
import { AccessRuleFactory } from "./security/access/AccessRuleFactory.js";
import { SystemResponse } from "./http/response/SystemResponse.js";
export declare const DEFAULT_LANG = "en";
export declare const DEFAULT_LANG_VARIATION = "us";
export declare abstract class System extends EventEmitter implements Bootable {
    static EVENT_SYSTEM_MODULE_ADDED: string;
    static EVENT_SYSTEM_RESOURCE_MODIFIED: string;
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
    protected _boot: BootSequence;
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
     * <ModuleListener>
     * AccessPolicyEnforcer traverse through each module gathering
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
        [langVariation: string]: any;
    };
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
    constructor(name: string);
    boot(): Promise<boolean>;
    getBootFunction(): (() => Promise<boolean>) | (() => boolean);
    /**
     * Public access to this system modules instances
     */
    getSystemModules(): Map<string, Module>;
    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): Knex;
    /**
     * Public access to this system database connection
     */
    abstract getSystemConnection(): Knex;
    /**
     * Public access to this system authenticator
     */
    abstract getAuthenticator(): SystemAuthenticator;
    /**
     * Public access to this system data steward
     */
    getDataSteward(): ServerDataSteward;
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
    loginUser(user: SystemUser, request: SystemRequest): System;
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
    addUser(user: SystemUser, request: SystemRequest): System;
    getSystemVersion(): number;
    hasModule(moduleName: string): boolean;
    /**
     * Add Module
     * ------------
     * Add a Module to this system!
     *
     * @param modules
     */
    addModule(...modules: Module[]): void;
    getModule(moduleName: string): Module | undefined;
    getModuleById(id: number): Promise<Module>;
    getAllModules(): Module[];
    getConnectionManager(): ConnectionManager;
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
    handleRequest(request: SystemRequest): Promise<SystemResponse>;
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
    systemResponseFactory(data: any, request: ModuleRequest): Promise<SystemResponse>;
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
    protected handleRequestException(exception: AuriaException, request: ModuleRequest): SystemResponse;
    /**
     * Authenticate Request
     * ---------------------
     *
     * Validate the credentials in the request
     * @param request
     */
    authenticateRequest(request: SystemRequest): Promise<SystemUser>;
    /**
     * Promote to SystemRequest
     * -------------------------
     * Will transform an Express **Request** object to a **SystemRequest** object
     *
     * @param request Express **Request** object
     * @param stack RequestStack containing the digested URL
     */
    promoteToSystemRequest(request: ServerRequest, stack: RequestStack): SystemRequest;
    /**
     * Access Rule Factory
     * --------------------
     *
     * An Access Rule Factory will transform the AccessRules exposed by the ModuleListeners
     * in actual AccessRule Objects!
     */
    protected abstract getAccessRuleFactory(): AccessRuleFactory;
}
