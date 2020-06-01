var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from 'events';
// Default system modules
import { BootSequence } from "aurialib2";
// Params config import
// Exceptions
import { UnauthorizedAccess } from "./exceptions/kernel/UnauthorizedAccess.js";
import { SystemUser } from "./security/user/SystemUser.js";
import { ModuleManager } from "./module/ModuleManager.js";
import { ServerDataSteward } from "./database/dataSteward/ServerDataSteward.js";
import { AccessPolicyEnforcer } from "./security/access/AccessPolicyEnforcer.js";
import { ResourceManager } from "./resource/ResourceManager.js";
import { ConnectionManager } from "./connection/ConnectionManager.js";
import { SystemRequestFactory } from "./http/request/SystemRequest.js";
import { SystemModule } from "./module/SystemModule/SystemModule.js";
import { UserNotLoggedIn } from "./exceptions/kernel/UserNotLoggedIn.js";
import { ModuleUnavaliable } from "./exceptions/kernel/ModuleUnavaliable.js";
import { ModuleRequestFactory } from "./http/request/ModuleRequest.js";
import { Auria_ENV } from "../AuriaServer.js";
export const DEFAULT_LANG = "en";
export const DEFAULT_LANG_VARIATION = "us";
let System = /** @class */ (() => {
    class System extends EventEmitter {
        constructor(name) {
            super();
            /**
             * Translations
             * ------------
             *
             * Hold all the loaded translations from this server
             * (Should be here?)
             */
            this.loadedTranslations = {};
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
            new SystemModule(this));
        }
        /**
         * Public access to this system modules instances
         */
        getSystemModules() {
            let modules = new Map();
            this.moduleManager.getAllModules().forEach((mod) => {
                modules.set(mod.name, mod);
            });
            return modules;
        }
        /**
         * Public access to this system data steward
         */
        getDataSteward() {
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
        loginUser(user, request) {
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
        addUser(user, request) {
            user.startSession(request);
            this.users.set(user.getUsername(), user);
            return this;
        }
        getSystemVersion() {
            return this.systemVersion;
        }
        hasModule(moduleName) {
            return this.moduleManager.hasModule(moduleName);
        }
        /**
         * Add Module
         * ------------
         * Add a Module to this system!
         *
         * @param modules
         */
        addModule(...modules) {
            modules.forEach((mod) => {
                this.moduleManager.addModule(mod);
                this.emit(System.EVENT_SYSTEM_MODULE_ADDED, mod);
            });
        }
        getModule(moduleName) {
            return this.moduleManager.getModule(moduleName);
        }
        getAllModules() {
            return this.moduleManager.getAllModules();
        }
        getConnectionManager() {
            return this.connectionManager;
        }
        getUser(username) {
            if (this.users.has(username)) {
                return this.users.get(username);
            }
            else {
                return null;
            }
        }
        isUserLoggedIn(username) {
            return this.users.get(username) != null;
        }
        removeUser(username) {
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
        handleRequest(request, response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                let user;
                try {
                    user = yield this.authenticateRequest(request);
                }
                catch (err) {
                    console.log("FAILED TO AUTHENTICATE: ", err, err instanceof UserNotLoggedIn);
                    user = new SystemUser(this, SystemUser.GUEST_USERNAME);
                }
                console.log("[Request] Checking user permission!");
                let authorized = yield this.accessPolicyEnforcer.authorize(user, request);
                if (!authorized) {
                    throw new UnauthorizedAccess("The current user is not elegible to access this resource!");
                }
                let requestedModule = request.getRequestStack().module();
                if (!this.moduleManager.hasModule(requestedModule)) {
                    throw new ModuleUnavaliable("The requested module does not exist in this system!");
                }
                let module = this.moduleManager.getModule(requestedModule);
                let moduleRequest = ModuleRequestFactory.make(request, user, module);
                let requestResponse = module.handleRequest(moduleRequest, response);
                let resp = yield this.systemResponseFactory(requestResponse, response);
                response.send(resp);
                return resp;
            });
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
        systemResponseFactory(data, response) {
            return __awaiter(this, void 0, void 0, function* () {
                /**
                 * HTTP Response should be handled by the system itself and not the server!
                 *
                 * Server is just a container for systems, an entrypoint
                 */
                if (data instanceof Promise) {
                    return data
                        .then((ans) => {
                        console.log("[Server] Response to request: ", ans);
                        let srvResponse = {
                            digest: "ok",
                            error: "",
                            exitCode: "SYSTEM.REQUEST.FINISHED",
                            response: ans
                        };
                        return srvResponse;
                    }).catch((err) => {
                        let exc = err;
                        return this.handleRequestException(exc, response);
                    });
                }
                else {
                    console.log("[Server] Response to request: ", data);
                    let srvResponse = {
                        digest: "ok",
                        error: "",
                        exitCode: "SYSTEM.REQUEST.FINISHED",
                        response: data
                    };
                    return srvResponse;
                }
            });
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
        handleRequestException(exception, response) {
            console.error("[Server] Failed to proccess request!", exception);
            response.status(exception.getHttpCode());
            let sendArgs = {
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
        authenticateRequest(request) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.getAuthenticator().authenticateRequest(request);
            });
        }
        /**
         * Promote to SystemRequest
         * -------------------------
         * Will transform an Express **Request** object to a **SystemRequest** object
         *
         * @param request Express **Request** object
         * @param stack RequestStack containing the digested URL
         */
        promoteToSystemRequest(request, stack) {
            return this.systemRequestFactory.make(request, this, stack);
        }
    }
    System.EVENT_SYSTEM_MODULE_ADDED = "SystemModuleAdded";
    System.EVENT_SYSTEM_RESOURCE_MODIFIED = "SystemResourceModified";
    return System;
})();
export { System };
