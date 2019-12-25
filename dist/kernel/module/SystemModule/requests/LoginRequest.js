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
                    response.setHeader("X-Auria-Access-Token", token);
                    return logInUser;
                });
            })
        });
    }
}
exports.LoginRequestFactory = LoginRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5SZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL3JlcXVlc3RzL0xvZ2luUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBS0EsNkRBQTBEO0FBYzFELE1BQWEsbUJBQW1CO0lBRXJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBc0IsRUFBRSxRQUFrQixFQUFFLE1BQWM7UUFFekUsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7WUFFOUIsU0FBUyxFQUFFLENBQUMsSUFBWSxFQUFFLEtBQWEsRUFBRSxPQUFzQixFQUFFLEVBQUU7Z0JBQy9ELE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFFRCxpQkFBaUIsRUFBRSxDQUFPLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxPQUFxQixFQUFFLEVBQUU7Z0JBRW5GLE9BQU8sTUFBTTtxQkFDUixnQkFBZ0IsRUFBRTtxQkFDbEIsWUFBWSxDQUFDO29CQUNWLFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUUsUUFBUTtpQkFDckIsQ0FBQztxQkFDRCxJQUFJLENBQUMsQ0FBQyxXQUFtQyxFQUFFLEVBQUU7b0JBQzFDLCtCQUErQjtvQkFDL0IsSUFBSSxTQUFTLEdBQUcsSUFBSSx1QkFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDakQsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2hDLFNBQVMsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUUvQyx1QkFBdUI7b0JBQ3ZCLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUVyQywwQ0FBMEM7b0JBQzFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDO29CQUVsQyxpQ0FBaUM7b0JBQ2pDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM3RSxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUU7d0JBQ3ZDLE1BQU0sRUFBRyxJQUFJLEdBQUMsRUFBRSxHQUFDLEVBQUUsR0FBQyxDQUFDO3dCQUNyQixRQUFRLEVBQUcsSUFBSTtxQkFDbEIsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFO3dCQUN0QyxNQUFNLEVBQUcsSUFBSSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsQ0FBQzt3QkFDckIsUUFBUSxFQUFHLEtBQUs7cUJBQ2xCLENBQUMsQ0FBQztvQkFDSCxRQUFRLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUVsRCxPQUFPLFNBQVMsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLENBQUM7WUFFWCxDQUFDLENBQUE7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFoREQsa0RBZ0RDIn0=