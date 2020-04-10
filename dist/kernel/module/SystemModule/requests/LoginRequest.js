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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5SZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL3JlcXVlc3RzL0xvZ2luUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUtBLDZEQUEwRDtBQUMxRCx3RkFBNEc7QUFhNUcsTUFBYSxtQkFBbUI7SUFFckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFzQixFQUFFLFFBQWtCLEVBQUUsTUFBYztRQUV6RSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtZQUU5QixTQUFTLEVBQUUsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLE9BQXNCLEVBQUUsRUFBRTtnQkFDL0QsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUVELGlCQUFpQixFQUFFLENBQU8sUUFBZ0IsRUFBRSxRQUFnQixFQUFFLE9BQXFCLEVBQUUsRUFBRTtnQkFFbkYsT0FBTyxNQUFNO3FCQUNSLGdCQUFnQixFQUFFO3FCQUNsQixZQUFZLENBQUM7b0JBQ1YsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2lCQUNyQixDQUFDO3FCQUNELElBQUksQ0FBQyxDQUFDLFdBQW1DLEVBQUUsRUFBRTtvQkFFMUMsK0JBQStCO29CQUMvQixJQUFJLFNBQVMsR0FBRyxJQUFJLHVCQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNqRCxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDaEMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRS9DLHVCQUF1QjtvQkFDdkIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBRXJDLDBDQUEwQztvQkFDMUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBRWxDLGlDQUFpQztvQkFDakMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUMsMkJBQTJCLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzdFLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRTt3QkFDdkMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7d0JBQzFCLFFBQVEsRUFBRSxJQUFJO3FCQUNqQixDQUFDLENBQUM7b0JBQ0gsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUU7d0JBQ3JDLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO3dCQUMxQixRQUFRLEVBQUUsS0FBSztxQkFDbEIsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQyxTQUFTLENBQUMsNENBQW9CLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRTlFLGlCQUFpQjtvQkFDakIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7d0JBRXBDLElBQUksV0FBVyxHQUFHOzRCQUNkLElBQUksRUFBRSxRQUFROzRCQUNkLFVBQVUsRUFBRSxTQUFTLENBQUMsWUFBWSxFQUFFOzRCQUNwQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs0QkFDM0IsS0FBSyxFQUFFLEtBQUs7NEJBQ1osTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJOzRCQUNuQixNQUFNLEVBQUUsYUFBYTs0QkFDckIsVUFBVSxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUU7eUJBQ3ZDLENBQUM7d0JBRUYsTUFBTSxDQUFDLG1CQUFtQixFQUFFOzZCQUN2QixNQUFNLENBQUMsV0FBVyxDQUFDOzZCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDOzZCQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFhLEVBQUUsRUFBRTs0QkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDekYsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFOzRCQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0RBQXNELEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ2pGLENBQUMsQ0FBQyxDQUFDO3FCQUNWO29CQUNELE9BQU8sU0FBUyxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztZQUVYLENBQUMsQ0FBQTtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXZFRCxrREF1RUMifQ==