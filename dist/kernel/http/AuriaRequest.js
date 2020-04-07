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