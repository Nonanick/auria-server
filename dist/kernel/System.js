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
const AuriaServer_1 = require("../AuriaServer");
const SystemModule_1 = require("./module/SystemModule/SystemModule");
const ModuleManager_1 = require("./module/ModuleManager");
const AuthModule_1 = require("./module/AuthModule/AuthModule");
const DataTypeRepository_1 = require("./database/structure/dataType/DataTypeRepository");
const ModuleRequest_1 = require("./http/request/ModuleRequest");
exports.DEFAULT_LANG = "en";
exports.DEFAULT_LANG_VARIATION = "us";
class System {
    constructor(server, name) {
        /**
         * Translations
         *
         * Hold all the loaded translations from this server
         */
        this.loadedTranslations = {};
        this.name = name;
        this.server = server;
        console.log("[System] Creating new system: ", name);
        this.connection = this.buildSystemConnection();
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
    getDataType(name) {
        return DataTypeRepository_1.DataTypeRepository[name];
    }
    addUser(user) {
        this.users.set(user.getUsername(), user);
        return this;
    }
    getSystemVersion() {
        return this.systemVersion;
    }
    getServer() {
        return this.server;
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
    removeUser(username) {
        return this.users.delete(username);
    }
    getConnection(connId) {
    }
    handleRequest(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.getAuthenticator().digestUser(request);
            let moduleRequest = ModuleRequest_1.ModuleRequestFactory.make(request, user);
        });
    }
}
exports.System = System;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9TeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLGdEQUF3RDtBQUN4RCxxRUFBa0U7QUFDbEUsMERBQXVEO0FBRXZELCtEQUE0RDtBQUc1RCx5RkFBc0Y7QUFLdEYsZ0VBQW9FO0FBRXZELFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFBLHNCQUFzQixHQUFHLElBQUksQ0FBQztBQUUzQyxNQUFzQixNQUFNO0lBd0R4QixZQUFZLE1BQW1CLEVBQUUsSUFBWTtRQVQ3Qzs7OztXQUlHO1FBQ08sdUJBQWtCLEdBRXhCLEVBQUUsQ0FBQztRQUdILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUUvQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QywwREFBMEQ7UUFDMUQsSUFBRyx1QkFBUyxJQUFJLGFBQWE7WUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O1lBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTRDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLFNBQVM7UUFDViw0QkFBNEI7UUFDNUIsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQztRQUVwQixzQ0FBc0M7UUFDdEMsSUFBSSwyQkFBWSxDQUFDLElBQUksQ0FBQyxDQUN6QixDQUFDO0lBQ04sQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFhO1FBQzVCLE9BQU8sdUNBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQWdDTSxPQUFPLENBQUMsSUFBZ0I7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxTQUFTLENBQUMsVUFBa0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sU0FBUyxDQUFDLEdBQUcsTUFBZ0I7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ25CLElBQUksWUFBWSxHQUFHLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV6QyxLQUFJLElBQUksSUFBSSxJQUFJLFlBQVksRUFBRTtnQkFDMUIsSUFBRyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO2lCQUNyQzthQUNKO1lBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRU0sU0FBUyxDQUFDLFVBQWtCO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVNLGFBQWE7UUFDaEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFTSxPQUFPLENBQUMsUUFBZ0I7UUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBZSxDQUFDO1NBQ2pEO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVNLFVBQVUsQ0FBQyxRQUFnQjtRQUM5QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxhQUFhLENBQUMsTUFBZTtJQUVwQyxDQUFDO0lBRVksYUFBYSxDQUFFLE9BQXVCLEVBQUUsUUFBbUIsRUFBRSxJQUFtQjs7WUFFekYsSUFBSSxJQUFJLEdBQWdCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFFLElBQUksYUFBYSxHQUFHLG9DQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakUsQ0FBQztLQUFBO0NBRUo7QUFyTEQsd0JBcUxDIn0=