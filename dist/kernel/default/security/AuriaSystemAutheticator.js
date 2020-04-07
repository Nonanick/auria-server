"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SystemAuthenticator_1 = require("../../security/auth/SystemAuthenticator");
const SystemUser_1 = require("../../security/SystemUser");
const jwt = __importStar(require("jsonwebtoken"));
const Auth_1 = require("../../../config/Auth");
class AuriaSystemAuthenticator extends SystemAuthenticator_1.SystemAuthenticator {
    constructor(system) {
        super(system);
        this.jwtConfig = Auth_1.AuthConfig;
    }
    authenticate(user) {
        throw new Error("Method not implemented.");
    }
    isAuthenticated(user) {
        throw new Error("Method not implemented.");
    }
    authenticateRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let systemUser = new SystemUser_1.SystemUser(this.system, "guest");
            let token = request.headers['auria-access-token'];
            console.log("User Access Token:", token);
            if (token != undefined) {
                let validateToken = this.validateToken(token);
                if (validateToken.valid) {
                    let tokenUsername = validateToken.authInfo.username;
                    let tokenSystem = validateToken.authInfo.targetedSystem;
                    if (tokenSystem == this.system.name && this.system.isUserLoggedIn(tokenUsername)) {
                        systemUser = this.system.getUser(tokenUsername);
                        console.log("[CoreAuthenticator] Request Token is valid and user is logged into the system!");
                    }
                }
            }
            return systemUser;
        });
    }
    /**
     * Generates an JSON Web Token to be used as an authentication by the user
     * ------------------------------------------------------------------------
     *
     * @param user
     */
    generateAuthenticationToken(user) {
        let userAuthInfo = {
            loginTime: Date.now(),
            systemVersion: this.system.getSystemVersion(),
            targetedSystem: this.system.name,
            username: user.getUsername(),
            user_id: user.getId()
        };
        let token = jwt.sign(userAuthInfo, this.jwtConfig.jwtSecret, {
            expiresIn: '2 days'
        });
        return token;
    }
    validateToken(jwtToken) {
        try {
            let jwtDecipher = jwt.verify(jwtToken, this.jwtConfig.jwtSecret, { maxAge: "2 days" });
            return {
                valid: true,
                authInfo: jwtDecipher
            };
        }
        catch (ex) {
            return {
                valid: false,
                authInfo: undefined
            };
        }
    }
}
exports.AuriaSystemAuthenticator = AuriaSystemAuthenticator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTeXN0ZW1BdXRoZXRpY2F0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL2RlZmF1bHQvc2VjdXJpdHkvQXVyaWFTeXN0ZW1BdXRoZXRpY2F0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpRkFBOEU7QUFFOUUsMERBQXVEO0FBRXZELGtEQUFvQztBQUNwQywrQ0FBa0U7QUFnQmxFLE1BQWEsd0JBQXlCLFNBQVEseUNBQW1CO0lBSzdELFlBQVksTUFBZTtRQUN2QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFVLENBQUM7SUFDaEMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUF5QjtRQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFnQjtRQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVZLG1CQUFtQixDQUFDLE9BQXNCOztZQUVuRCxJQUFJLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUV0RCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV6QyxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7Z0JBQ3BCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBZSxDQUFDLENBQUM7Z0JBQ3hELElBQUksYUFBYSxDQUFDLEtBQUssRUFBRTtvQkFDckIsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLFFBQVMsQ0FBQyxRQUFRLENBQUM7b0JBQ3JELElBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxRQUFTLENBQUMsY0FBYyxDQUFDO29CQUV6RCxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRTt3QkFDOUUsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBRSxDQUFDO3dCQUVqRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdGQUFnRixDQUFDLENBQUM7cUJBQ2pHO2lCQUNKO2FBQ0o7WUFDRCxPQUFPLFVBQVUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNJLDJCQUEyQixDQUFDLElBQWdCO1FBRS9DLElBQUksWUFBWSxHQUFpQjtZQUM3QixTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNyQixhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtZQUM3QyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ2hDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFO1NBQ3hCLENBQUM7UUFFRixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUNoQixZQUFZLEVBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3hCO1lBQ0ksU0FBUyxFQUFFLFFBQVE7U0FDdEIsQ0FDSixDQUFDO1FBRUYsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVPLGFBQWEsQ0FBQyxRQUFnQjtRQUNsQyxJQUFJO1lBQ0EsSUFBSSxXQUFXLEdBQWlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFRLENBQUM7WUFFNUcsT0FBTztnQkFDSCxLQUFLLEVBQUUsSUFBSTtnQkFDWCxRQUFRLEVBQUUsV0FBVzthQUN4QixDQUFDO1NBQ0w7UUFDRCxPQUFPLEVBQUUsRUFBRTtZQUNQLE9BQU87Z0JBQ0gsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osUUFBUSxFQUFFLFNBQVM7YUFDdEIsQ0FBQztTQUNMO0lBRUwsQ0FBQztDQUlKO0FBekZELDREQXlGQyJ9