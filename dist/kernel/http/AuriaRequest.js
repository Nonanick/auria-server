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
const SystemUser_1 = require("../security/SystemUser");
class AuriaRequest {
    constructor(request) {
        this.system = "";
        this.bodyData = {};
        this.request = request;
        this.bodyData = Object.assign({}, this.request.body, this.request.query);
        let reqInfo = this.digestUrl();
        this.system = reqInfo.system;
        this.module = reqInfo.module;
        this.listener = reqInfo.listener;
        this.action = reqInfo.action;
    }
    setSystem(system) {
        this.resolvedSystem = system;
        return this;
    }
    digestUrl() {
        this.url = this.request.path;
        let urlPieces = this.url.split('/');
        let system = urlPieces[1] != null ? urlPieces[1] : "";
        let moduleName = urlPieces[2] != null ? urlPieces[2] : "";
        let listener = urlPieces[3] != null ? urlPieces[3] : "";
        let action = urlPieces[4] != null ? urlPieces[4] : "default";
        return {
            system: system,
            module: moduleName,
            listener: listener,
            action: action
        };
    }
    digestUser() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new SystemUser_1.SystemUser(this.resolvedSystem, "guest");
            // # - Dev ONLY!
            if (this.bodyData["auria-credentials"]) {
                let cred = this.bodyData["auria-credentials"];
                if (cred.username == "dev-master" && cred.token == "123456") {
                    if (this.resolvedSystem.getUser("dev-master") == null) {
                        console.log("[Request-DEV]: Dev Master is not logged in yet...");
                        let devMaster = new SystemUser_1.SystemUser(this.resolvedSystem, "dev-master");
                        devMaster.setAccessLevel(SystemUser_1.SystemUserPrivilege.MASTER);
                        this.resolvedSystem.addUser(devMaster);
                        user = devMaster;
                    }
                    else {
                        user = this.resolvedSystem.getUser("dev-master");
                    }
                }
            }
            //Cookie validation?
            let loggedUsername = this.getCookie(SystemUser_1.SystemUser.COOKIE_USERNAME);
            let loggedHandshake = this.getCookie(SystemUser_1.SystemUser.COOKIE_HANDSHAKE);
            //console.log("[Request-Cookies]: Username:'" + loggedUsername + "'\nHandshake: '" + loggedHandshake + "'");
            if (loggedUsername != "" && loggedHandshake != "") {
                let cookieUser = yield this.validateCookieAuthentication(loggedUsername, loggedHandshake);
                if (cookieUser != null) {
                    user = cookieUser;
                }
            }
            user.setUserAgent(this.getUserAgent());
            user.setIp(this.getIp());
            this.user = user;
            return user;
        });
    }
    validateCookieAuthentication(username, handshake) {
        return __awaiter(this, void 0, void 0, function* () {
            let loggedUser = this.resolvedSystem.getUser(username);
            // # - Is logged into the system?
            if (loggedUser != null) {
                let validHandshake = yield loggedUser.validateHandshake(this, handshake);
                if (validHandshake) {
                    return loggedUser;
                }
                else {
                    console.error("[AuriaRequest] Invalid handshake, failed to authenticate user");
                }
            }
            else {
                console.error("[AuriaRequest] User requested is not logged in!", username);
            }
            return null;
        });
    }
    getBody() {
        return this.bodyData;
    }
    getSystemName() {
        return this.system;
    }
    getModuleName() {
        return this.module;
    }
    getListenerName() {
        return this.listener;
    }
    getActionName() {
        return this.action;
    }
    getUser() {
        return this.user;
    }
    getRawRequest() {
        return this.request;
    }
    /**
     * Get a required params, failure to fetch them from request body
     * will throw an error and script will halt!
     * A parameter MUST have a value, setting it to null is also considered
     * as empty!
     *
     * To check a flag parameter was passed use 'hasParam'!
     *
     * Flag Parameters are parameters without assigned value
     *
     * @param param Parameter name!
     */
    requiredParam(...param) {
        let properAns = {};
        this.bodyData = Object.assign({}, this.request.body, this.request.query);
        param.forEach((p) => {
            if (this.bodyData[p] != null) {
                if (param.length == 1) {
                    properAns = this.bodyData[p];
                }
                else {
                    properAns[p] = this.bodyData[p];
                }
            }
            else {
                console.error("[AuriaRequest] Failed to proccess request, parameter '" + p + "' was not provided!");
                throw new Error("Wrong request, a required parameter was not provided!");
            }
        });
        return properAns;
    }
    reloadRequest(request) {
        this.request = request;
    }
    getParam(name) {
        if (this.bodyData[name] == null) {
            return "";
        }
        else {
            return this.bodyData[name];
        }
    }
    hasParam(param) {
        return this.bodyData[param] !== undefined;
    }
    param(param) {
        return this.getParam(param);
    }
    getIp() {
        return this.request.ip;
    }
    getUserAgent() {
        return this.request.headers['user-agent'];
    }
    getCookie(name) {
        //console.log("[Request] Get Cookie ", name ," value '", this.request.cookies[name], "'" );
        if (this.request.cookies != null) {
            return this.request.cookies[name] == null ? "" : this.request.cookies[name];
        }
        else
            return "";
    }
}
exports.AuriaRequest = AuriaRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFSZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9odHRwL0F1cmlhUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsdURBQXlFO0FBR3pFLE1BQWEsWUFBWTtJQW9CckIsWUFBWSxPQUFnQjtRQWxCbEIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQWdCcEIsYUFBUSxHQUFRLEVBQUUsQ0FBQztRQUl6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV2QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFekUsSUFBSSxPQUFPLEdBQWlCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUU3QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFakMsQ0FBQztJQUVNLFNBQVMsQ0FBQyxNQUFjO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxTQUFTO1FBRVosSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUU3QixJQUFJLFNBQVMsR0FBYSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU5QyxJQUFJLE1BQU0sR0FBVyxTQUFTLENBQUMsQ0FBQyxDQUFD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