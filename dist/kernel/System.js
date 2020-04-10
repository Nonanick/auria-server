"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const SystemRequest_1 = require("./http/request/SystemRequest");
const ModuleManager_1 = require("./module/ModuleManager");
const ModuleRequest_1 = require("./http/request/ModuleRequest");
// Default system modules
const SystemModule_1 = require("./module/SystemModule/SystemModule");
const SystemUser_1 = require("./security/SystemUser");
// Params config import
const AuriaServer_1 = require("../AuriaServer");
// Exceptions
const ModuleUnavaliable_1 = require("./exceptions/kernel/ModuleUnavaliable");
const AccessPolicyEnforcer_1 = require("./security/access/AccessPolicyEnforcer");
const UnauthorizedAccess_1 = require("./exceptions/kernel/UnauthorizedAccess");
const UserNotLoggedIn_1 = require("./exceptions/kernel/UserNotLoggedIn");
const EntityManager_1 = require("./entity/EntityManager");
exports.DEFAULT_LANG = "en";
exports.DEFAULT_LANG_VARIATION = "us";
class System extends events_1.EventEmitter {
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
        this.systemRequestFactory = new SystemRequest_1.SystemRequestFactory();
        this.entityManager = new EntityManager_1.EntityManager(this);
        //Should not be here! Use on install routine!
        if (AuriaServer_1.Auria_ENV == "development") {
            this.entityManager.setSystemConnection(this.getSystemConnection());
            this.entityManager.installSchema();
        }
        this.moduleManager = new ModuleManager_1.ModuleManager(this);
        this.accessPolicyEnforcer = new AccessPolicyEnforcer_1.AccessPolicyEnforcer(this);
        this.users = new Map();
        this.accessPolicyEnforcer.setAccessRuleFactory(this.getAccessRuleFactory());
        // If ENV == "development", systemversion does not change!
        this.systemVersion = AuriaServer_1.Auria_ENV == "development" ?
            1 : Math.round(Math.random() * 1000000);
        console.log("[System] Initializing modules from system ", name);
        this.addModule(
        // # - System related functions
        new SystemModule_1.SystemModule(this));
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
                console.log("FAILED TO AUTHENTICATE: ", err, err instanceof UserNotLoggedIn_1.UserNotLoggedIn);
                user = new SystemUser_1.SystemUser(this, SystemUser_1.SystemUser.GUEST_USERNAME);
            }
            console.log("[Request] Checking user permission!");
            let authorized = yield this.accessPolicyEnforcer.authorize(user, request);
            if (!authorized) {
                throw new UnauthorizedAccess_1.UnauthorizedAccess("The current user is not elegible to access this resource!");
            }
            let requestedModule = request.getRequestStack().module();
            if (!this.moduleManager.hasModule(requestedModule)) {
                throw new ModuleUnavaliable_1.ModuleUnavaliable("The requested module does not exist in this system!");
            }
            let module = this.moduleManager.getModule(requestedModule);
            let moduleRequest = ModuleRequest_1.ModuleRequestFactory.make(request, user, module);
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
                        exitCode: "SYSTEM.REQUEST.SUCCESS",
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
                    exitCode: "SYSTEM.REQUEST.SUCCESS",
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
exports.System = System;
System.EVENT_SYSTEM_MODULE_ADDED = "SystemModuleAdded";
System.EVENT_SYSTEM_RESOURCE_MODIFIED = "SystemResourceModified";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9TeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtQ0FBc0M7QUFDdEMsZ0VBQW1GO0FBRW5GLDBEQUF1RDtBQUV2RCxnRUFBb0U7QUFHcEUseUJBQXlCO0FBQ3pCLHFFQUFrRTtBQUVsRSxzREFBbUQ7QUFJbkQsdUJBQXVCO0FBQ3ZCLGdEQUEyQztBQUMzQyxhQUFhO0FBQ2IsNkVBQTBFO0FBRTFFLGlGQUE4RTtBQUM5RSwrRUFBNEU7QUFFNUUseUVBQXNFO0FBR3RFLDBEQUF1RDtBQUUxQyxRQUFBLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBQSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7QUFFM0MsTUFBc0IsTUFBTyxTQUFRLHFCQUFZO0lBeUc3QyxZQUFZLElBQVk7UUFDcEIsS0FBSyxFQUFFLENBQUM7UUF6Qlo7Ozs7OztXQU1HO1FBQ08sdUJBQWtCLEdBRXhCLEVBQUUsQ0FBQztRQWtCSCxPQUFPLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9DQUFvQixFQUFFLENBQUM7UUFHdkQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsNkNBQTZDO1FBQzdDLElBQUksdUJBQVMsSUFBSSxhQUFhLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEM7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FB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