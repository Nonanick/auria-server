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
const ModuleListener_1 = require("../../ModuleListener");
const LogoutFailed_1 = require("../exceptions/login/LogoutFailed");
const LoginFailed_1 = require("../exceptions/login/LoginFailed");
const LoginAttemptManager_1 = require("./login/LoginAttemptManager");
class LoginListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "LoginListener");
        this.login = (req) => __awaiter(this, void 0, void 0, function* () {
            let loginReq = req;
            let username = req.getRequiredParam('username');
            let currentAttempt = this.loginAttemptManager.requestLoginAttempt(loginReq);
            // Login with password
            if (req.hasParam('password')) {
                let password = req.getRequiredParam('password');
                return loginReq
                    .loginWithPassword(username, password, loginReq)
                    .then((user) => {
                    // Login successfull
                    currentAttempt.success = true;
                    let attempts = this.loginAttemptManager.clearLoginAttempts(loginReq);
                    return {
                        message: "Login Successful!",
                        attempts: attempts,
                        username: user.getUsername(),
                        system: req.getRequestStack().system()
                    };
                }).catch((err) => {
                    throw err;
                });
            }
            else {
                throw new LoginFailed_1.LoginFailed("Insufficient parameters passed!");
            }
        });
        this.logout = (req) => {
            let loginReq = req;
            let username = req.getRequiredParam("username");
            let cookie = req.getCookie('AURIA_UA_USERNAME');
            //let handshake = req.getCookie('AURIA_UA_HANDSHAKE');
            if (username == cookie) {
                loginReq.setCookie("AURIA_UA_USERNAME", "", {
                    expires: new Date(),
                    httpOnly: true
                });
                loginReq.setCookie("AURIA_UA_HANDSHAKE", "", {
                    expires: new Date(),
                    httpOnly: true
                });
                this.module.getSystem().removeUser(username);
                return { "logout": true };
            }
            else {
                throw new LogoutFailed_1.LogoutFailed("Server information does not match the request");
            }
        };
        this.loginAttemptManager = new LoginAttemptManager_1.LoginAttemptManager();
    }
    getRequiredRequestHandlers() {
        return [];
    }
    getExposedActionsDefinition() {
        return {
            "login": {},
            "handshake": {},
            "keepalive": {},
            "logout": {},
        };
    }
}
exports.LoginListener = LoginListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5MaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvTG9naW5MaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQWlHO0FBTWpHLG1FQUFnRTtBQUVoRSxpRUFBOEQ7QUFDOUQscUVBQWtFO0FBR2xFLE1BQWEsYUFBYyxTQUFRLCtCQUFjO0lBUTdDLFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBYzVCLFVBQUssR0FBbUIsQ0FBTyxHQUFHLEVBQUUsRUFBRTtZQUV6QyxJQUFJLFFBQVEsR0FBa0IsR0FBb0IsQ0FBQztZQUNuRCxJQUFJLFFBQVEsR0FBVyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFeEQsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTVFLHNCQUFzQjtZQUN0QixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxRQUFRO3FCQUNWLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO3FCQUMvQyxJQUFJLENBQ0QsQ0FBQyxJQUFnQixFQUFFLEVBQUU7b0JBQ2pCLG9CQUFvQjtvQkFDcEIsY0FBYyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQzlCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFckUsT0FBTzt3QkFDSCxPQUFPLEVBQUUsbUJBQW1CO3dCQUM1QixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQzVCLE1BQU0sRUFBRSxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxFQUFFO3FCQUN6QyxDQUFDO2dCQUNOLENBQUMsQ0FDSixDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNaLE1BQU0sR0FBRyxDQUFDO2dCQUNkLENBQUMsQ0FBQyxDQUFDO2FBQ1Y7aUJBQ0k7Z0JBQ0QsTUFBTSxJQUFJLHlCQUFXLENBQUMsaUNBQWlDLENBQUMsQ0FBQzthQUM1RDtRQUNMLENBQUMsQ0FBQSxDQUFDO1FBRUssV0FBTSxHQUFtQixDQUFDLEdBQUcsRUFBRSxFQUFFO1lBRXBDLElBQUksUUFBUSxHQUFrQixHQUFvQixDQUFDO1lBRW5ELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDaEQsc0RBQXNEO1lBRXRELElBQUksUUFBUSxJQUFJLE1BQU0sRUFBRTtnQkFFcEIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUU7b0JBQ3hDLE9BQU8sRUFBRSxJQUFJLElBQUksRUFBRTtvQkFDbkIsUUFBUSxFQUFFLElBQUk7aUJBQ2pCLENBQUMsQ0FBQztnQkFFSCxRQUFRLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsRUFBRTtvQkFDekMsT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFO29CQUNuQixRQUFRLEVBQUUsSUFBSTtpQkFDakIsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU3QyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzdCO2lCQUFNO2dCQUNILE1BQU0sSUFBSSwyQkFBWSxDQUFDLCtDQUErQyxDQUFDLENBQUM7YUFDM0U7UUFFTCxDQUFDLENBQUM7UUF6RUUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztJQUN6RCxDQUFDO0lBUk0sMEJBQTBCO1FBQzdCLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQVFNLDJCQUEyQjtRQUM5QixPQUFPO1lBQ0gsT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsRUFBRTtZQUNmLFdBQVcsRUFBRSxFQUFFO1lBQ2YsUUFBUSxFQUFFLEVBQUU7U0FDZixDQUFDO0lBQ04sQ0FBQztDQWlFSjtBQXRGRCxzQ0FzRkMifQ==