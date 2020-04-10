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
const ModuleListener_1 = require("../../ModuleListener");
const LogoutFailed_1 = require("../exceptions/login/LogoutFailed");
const LoginFailed_1 = require("../exceptions/login/LoginFailed");
const LoginAttemptManager_1 = require("./actions/login/LoginAttemptManager");
// # - Login Action Metadata
const LoginActionDefinition_1 = require("./actions/login/LoginActionDefinition");
const LogoutActionDefinition_1 = require("./actions/logout/LogoutActionDefinition");
class LoginListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "Login");
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
    getExposedActionsMetadata() {
        return {
            "login": LoginActionDefinition_1.LoginActionMetadata,
            "logout": LogoutActionDefinition_1.LogoutActionMetadata,
        };
    }
}
exports.LoginListener = LoginListener;
/**
 * Amount of time required to complete
 * the login request
 */
LoginListener.LOGIN_LISTENER_DELAY_LOGIN_ATTEMPT = 1000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5MaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvTG9naW5MaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlEQUFzRDtBQUd0RCxtRUFBZ0U7QUFDaEUsaUVBQThEO0FBQzlELDZFQUEwRTtBQUkxRSw0QkFBNEI7QUFDNUIsaUZBQTRFO0FBQzVFLG9GQUErRTtBQUUvRSxNQUFhLGFBQWMsU0FBUSwrQkFBYztJQVU3QyxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQVlwQixVQUFLLEdBQW1CLENBQU8sR0FBRyxFQUFFLEVBQUU7WUFFekMsSUFBSSxRQUFRLEdBQWtCLEdBQW9CLENBQUM7WUFDbkQsSUFBSSxRQUFRLEdBQVcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXhELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1RSxzQkFBc0I7WUFDdEIsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2hELE9BQU8sUUFBUTtxQkFDVixpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztxQkFDL0MsSUFBSSxDQUNELENBQUMsSUFBZ0IsRUFBRSxFQUFFO29CQUNqQixvQkFBb0I7b0JBQ3BCLGNBQWMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUM5QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXJFLE9BQU87d0JBQ0gsT0FBTyxFQUFFLG1CQUFtQjt3QkFDNUIsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUM1QixNQUFNLEVBQUUsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sRUFBRTtxQkFDekMsQ0FBQztnQkFDTixDQUFDLENBQ0osQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDWixNQUFNLEdBQUcsQ0FBQztnQkFDZCxDQUFDLENBQUMsQ0FBQzthQUNWO2lCQUNJO2dCQUNELE1BQU0sSUFBSSx5QkFBVyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7YUFDNUQ7UUFDTCxDQUFDLENBQUEsQ0FBQztRQUVLLFdBQU0sR0FBbUIsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUVwQyxJQUFJLFFBQVEsR0FBa0IsR0FBb0IsQ0FBQztZQUVuRCxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2hELHNEQUFzRDtZQUV0RCxJQUFJLFFBQVEsSUFBSSxNQUFNLEVBQUU7Z0JBRXBCLFFBQVEsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxFQUFFO29CQUN4QyxPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUU7b0JBQ25CLFFBQVEsRUFBRSxJQUFJO2lCQUNqQixDQUFDLENBQUM7Z0JBRUgsUUFBUSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUU7b0JBQ3pDLE9BQU8sRUFBRSxJQUFJLElBQUksRUFBRTtvQkFDbkIsUUFBUSxFQUFFLElBQUk7aUJBQ2pCLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUM3QjtpQkFBTTtnQkFDSCxNQUFNLElBQUksMkJBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO2FBQzNFO1FBRUwsQ0FBQyxDQUFDO1FBdkVFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7SUFDekQsQ0FBQztJQUVNLHlCQUF5QjtRQUM1QixPQUFPO1lBQ0gsT0FBTyxFQUFFLDJDQUFtQjtZQUM1QixRQUFRLEVBQUUsNkNBQW9CO1NBQ2pDLENBQUM7SUFDTixDQUFDOztBQXJCTCxzQ0FzRkM7QUFwRkc7OztHQUdHO0FBQ0ksZ0RBQWtDLEdBQUcsSUFBSSxDQUFDIn0=