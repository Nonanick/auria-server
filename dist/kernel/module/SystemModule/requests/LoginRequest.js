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
const SystemUser_1 = require("../../../security/SystemUser");
const PasswordAuthenticator_1 = require("../../../security/auth/PasswordAuthenticator");
class LoginRequestFactory {
    static make(request, response, system) {
        return Object.assign({}, request, {
            setCookie: (name, value, options) => {
                return response.cookie(name, value, options);
            },
            loginWithPassword: (username, password, request) => __awaiter(this, void 0, void 0, function* () {
                return system
                    .getAuthenticator()
                    .authenticate({
                    username: username,
                    password: password
                })
                    .then((authDetails) => {
                    // Initialize SystemUser object
                    let logInUser = new SystemUser_1.SystemUser(system, username);
                    logInUser.setId(authDetails.id);
                    logInUser.setAccessLevel(authDetails.userType);
                    //Add it to the system!
                    system.loginUser(logInUser, request);
                    // Replace 'getUser' in the request object
                    request.getUser = () => logInUser;
                    // Send back authentication token
                    let token = system.getAuthenticator().generateAuthenticationToken(logInUser);
                    response.cookie("AURIA_UA_NAME", username, {
                        maxAge: 1000 * 60 * 60 * 2,
                        httpOnly: true
                    });
                    response.cookie("AURIA_UA_TOKEN", token, {
                        maxAge: 1000 * 60 * 60 * 2,
                        httpOnly: false
                    });
                    response.setHeader(PasswordAuthenticator_1.PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME, token);
                    //Keep signed in?
                    if (request.hasParam("keep-signed-in")) {
                        let sessionInfo = {
                            user: username,
                            login_time: logInUser.getLoginTime(),
                            machine_ip: request.getIp(),
                            token: token,
                            system: system.name,
                            client: 'node-server',
                            user_agent: logInUser.getUserAgent()
                        };
                        system.getSystemConnection()
                            .insert(sessionInfo)
                            .into('sessions')
                            .then((ids) => {
                            console.log("[LoginRequest] Keep signed in option! Recorded in sessions! ID: ", ids);
                        }).catch(error => {
                            console.error("[LoginRequest] Failed to record session in database!", error);
                        });
                    }
                    return logInUser;
                });
            })
        });
    }
}
exports.LoginRequestFactory = LoginRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5SZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL3JlcXVlc3RzL0xvZ2luUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsNkRBQTBEO0FBQzFELHdGQUE0RztBQWE1RyxNQUFhLG1CQUFtQjtJQUVyQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQXNCLEVBQUUsUUFBa0IsRUFBRSxNQUFjO1FBRXpFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO1lBRTlCLFNBQVMsRUFBRSxDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsT0FBc0IsRUFBRSxFQUFFO2dCQUMvRCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBRUQsaUJBQWlCLEVBQUUsQ0FBTyxRQUFnQixFQUFFLFFBQWdCLEVBQUUsT0FBcUIsRUFBRSxFQUFFO2dCQUVuRixPQUFPLE1BQU07cUJBQ1IsZ0JBQWdCLEVBQUU7cUJBQ2xCLFlBQVksQ0FBQztvQkFDVixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsUUFBUSxFQUFFLFFBQVE7aUJBQ3JCLENBQUM7cUJBQ0QsSUFBSSxDQUFDLENBQUMsV0FBbUMsRUFBRSxFQUFFO29CQUUxQywrQkFBK0I7b0JBQy9CLElBQUksU0FBUyxHQUFHLElBQUksdUJBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ2pELFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNoQyxTQUFTLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFL0MsdUJBQXVCO29CQUN2QixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFFckMsMENBQTBDO29CQUMxQyxPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFFbEMsaUNBQWlDO29CQUNqQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDN0UsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFO3dCQUN2QyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDMUIsUUFBUSxFQUFFLElBQUk7cUJBQ2pCLENBQUMsQ0FBQztvQkFDSCxRQUFRLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRTt3QkFDckMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7d0JBQzFCLFFBQVEsRUFBRSxLQUFLO3FCQUNsQixDQUFDLENBQUM7b0JBQ0gsUUFBUSxDQUFDLFNBQVMsQ0FBQyw0Q0FBb0IsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFFOUUsaUJBQWlCO29CQUNqQixJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRTt3QkFFcEMsSUFBSSxXQUFXLEdBQUc7NEJBQ2QsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsVUFBVSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUU7NEJBQ3BDLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOzRCQUMzQixLQUFLLEVBQUUsS0FBSzs0QkFDWixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUk7NEJBQ25CLE1BQU0sRUFBRSxhQUFhOzRCQUNyQixVQUFVLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFBRTt5QkFDdkMsQ0FBQzt3QkFFRixNQUFNLENBQUMsbUJBQW1CLEVBQUU7NkJBQ3ZCLE1BQU0sQ0FBQyxXQUFXLENBQUM7NkJBQ25CLElBQUksQ0FBQyxVQUFVLENBQUM7NkJBQ2hCLElBQUksQ0FBQyxDQUFDLEdBQWEsRUFBRSxFQUFFOzRCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUN6RixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7NEJBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxzREFBc0QsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDakYsQ0FBQyxDQUFDLENBQUM7cUJBQ1Y7b0JBQ0QsT0FBTyxTQUFTLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBRVgsQ0FBQyxDQUFBO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBdkVELGtEQXVFQyJ9