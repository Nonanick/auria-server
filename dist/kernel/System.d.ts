/// <reference types="node" />
import { Response, NextFunction } from "express-serve-static-core";
import { EventEmitter } from 'events';
import { SystemRequest, SystemRequestFactory } from "./http/request/SystemRequest";
import { SystemAuthenticator } from "./security/auth/SystemAuthenticator";
import { ModuleManager } from "./module/ModuleManager";
import { Module } from "./module/Module";
import { RequestStack } from "./RequestStack";
import { SystemUser } from "./security/SystemUser";
import { DataSteward, Authenticator, ServerResponse } from "aurialib2";
import knex from 'knex';
import { ServerRequest } from "./http/request/ServerRequest";
import { AccessPolicyEnforcer } from "./security/access/AccessPolicyEnforcer";
import Knex from "knex";
import { AccessRuleFactory } from "./security/access/AccessRuleFactory";
import { AuriaException } from "./exceptions/AuriaException";
import { EntityManager } from "./entity/EntityManager";
export declare const DEFAULT_LANG = "en";
export declare const DEFAULT_LANG_VARIATION = "us";
export declare abstract class System extends EventEmitter {
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
    protected dataSteward: DataSteward;
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
    /**
     * Entity Manager
     * ----------------
     *
     * Class that loads all the metadata tables from the auria system table
     */
    protected entityManager: EntityManager;
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
    /**
     * Public access to this system modules instances
     */
    getSystemModules(): Map<string, Module>;
    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): knex;
    /**
     * Public access to this system database connection
     */
    abstract getSystemConnection(): knex;
    /**
     * Public access to this system authenticator
     */
    abstract getAuthenticator(): SystemAuthenticator;
    /**
     * Public access to this system data steward
     */
    abstract getDataSteward(): DataSteward;
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
    handleRequest(request: SystemRequest, response: Response, next: NextFunction): Promise<ServerResponse>;
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
    systemResponseFactory(data: any, response: Response): Promise<ServerResponse>;
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
    protected handleRequestException(exception: AuriaException, response: Response): ServerResponse;
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
