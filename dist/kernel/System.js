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
const SystemRequest_1 = require("./http/request/SystemRequest");
const ModuleManager_1 = require("./module/ModuleManager");
const ModuleRequest_1 = require("./http/request/ModuleRequest");
// Default system modules
const AuthModule_1 = require("./module/AuthModule/AuthModule");
const SystemModule_1 = require("./module/SystemModule/SystemModule");
// Params config import
const AuriaServer_1 = require("../AuriaServer");
// Exceptions
const ModuleUnavaliable_1 = require("./exceptions/kernel/ModuleUnavaliable");
exports.DEFAULT_LANG = "en";
exports.DEFAULT_LANG_VARIATION = "us";
class System {
    constructor(name) {
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
        // If ENV == "development", systemversion does not change!
        if (AuriaServer_1.Auria_ENV == "development")
            this.systemVersion = 1;
        else
            this.systemVersion = Math.round(Math.random() * 1000000);
        this.users = new Map();
        console.log("[System] Initializing modules from system ", name);
        this.addModule(
        // # - Authentication Module
        new AuthModule_1.AuthModule(this), 
        // # - System related functions Module
        new SystemModule_1.SystemModule(this));
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
    addModule(...module) {
        module.forEach((mod) => {
            let translations = mod.getTranslations();
            for (var lang in translations) {
                if (translations.hasOwnProperty(lang)) {
                }
            }
            this.moduleManager.addModule(mod);
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
            let user = yield this.getAuthenticator().authenticateRequest(request);
            let requestedModule = request.getRequestStack().module();
            if (!this.moduleManager.hasModule(requestedModule)) {
                throw new ModuleUnavaliable_1.ModuleUnavaliable("The requested module does not exist in this system!");
            }
            let module = this.moduleManager.getModule(requestedModule);
            let moduleRequest = ModuleRequest_1.ModuleRequestFactory.make(request, user, module);
            return module.handleRequest(moduleRequest, response);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9TeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLGdFQUFtRjtBQUVuRiwwREFBdUQ7QUFFdkQsZ0VBQW9FO0FBR3BFLHlCQUF5QjtBQUN6QiwrREFBNEQ7QUFDNUQscUVBQWtFO0FBTWxFLHVCQUF1QjtBQUN2QixnREFBMkM7QUFDM0MsYUFBYTtBQUNiLDZFQUEwRTtBQUk3RCxRQUFBLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBQSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7QUFFM0MsTUFBc0IsTUFBTTtJQThEeEIsWUFBWSxJQUFZO1FBbkJ4Qjs7Ozs7V0FLRztRQUNPLHVCQUFrQixHQUV4QixFQUFFLENBQUM7UUFZSCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQ0FBb0IsRUFBRSxDQUFDO1FBRXZELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0MsMERBQTBEO1FBQzFELElBQUksdUJBQVMsSUFBSSxhQUFhO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztZQUV2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUV2QixPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWhFLElBQUksQ0FBQyxTQUFTO1FBQ1YsNEJBQTRCO1FBQzVCLElBQUksdUJBQVUsQ0FB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