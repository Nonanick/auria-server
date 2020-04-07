"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
         */
        this.loadedTranslations = {};
        this.name = name;
        this.systemRequestFactory = new SystemRequest_1.SystemRequestFactory();
        console.log("[System] Creating new system: ", name);
        this.moduleManager = new ModuleManager_1.ModuleManager(this);
        this.accessPolicyEnforcer = new AccessPolicyEnforcer_1.AccessPolicyEnforcer(this);
        // If ENV == "development", systemversion does not change!
        if (AuriaServer_1.Auria_ENV == "development")
            this.systemVersion = 1;
        else
            this.systemVersion = Math.round(Math.random() * 1000000);
        // # - User currently online
        this.users = new Map();
        console.log("[System] Initializing modules from system ", name);
        this.accessPolicyEnforcer.setAccessRuleFactory(this.getAccessRuleFactory());
        this.addModule(
        // # - System related functions Module
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
    loginUser(user, request) {
        return this.addUser(user, request);
    }
    /**
     *
     * @param user
     * @param request
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
    addModule(...modules) {
        modules.forEach((mod) => {
            this.moduleManager.addModule(mod);
            this.emit(System.SYSTEM_MODULE_ADDED, mod);
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
    systemResponseFactory(data, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * HTTP Response should be handled by the system itself and not the server
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
System.SYSTEM_MODULE_ADDED = "SystemModuleAdded";
System.SYSTEM_RESOURCE_MODIFIED = "SystemResourceModified";
exports.System = System;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9TeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLG1DQUFzQztBQUN0QyxnRUFBbUY7QUFFbkYsMERBQXVEO0FBRXZELGdFQUFvRTtBQUdwRSx5QkFBeUI7QUFDekIscUVBQWtFO0FBRWxFLHNEQUFtRDtBQUluRCx1QkFBdUI7QUFDdkIsZ0RBQTJDO0FBQzNDLGFBQWE7QUFDYiw2RUFBMEU7QUFFMUUsaUZBQThFO0FBQzlFLCtFQUE0RTtBQUU1RSx5RUFBc0U7QUFJekQsUUFBQSxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUEsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBRTNDLE1BQXNCLE1BQU8sU0FBUSxxQkFBWTtJQXNFN0MsWUFBWSxJQUFZO1FBQ3BCLEtBQUssRUFBRSxDQUFDO1FBcEJaOzs7OztXQUtHO1FBQ08sdUJBQWtCLEdBRXhCLEVBQUUsQ0FBQztRQWNILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9DQUFvQixFQUFFLENBQUM7UUFFdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSwyQ0FBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzRCwwREFBMEQ7UUFDMUQsSUFBSSx1QkFBUyxJQUFJLGFBQWE7WUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O1lBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFN0QsNEJB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