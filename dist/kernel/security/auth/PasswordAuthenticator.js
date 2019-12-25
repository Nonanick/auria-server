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
const SystemAuthenticator_1 = require("./SystemAuthenticator");
const SystemUser_1 = require("../SystemUser");
const AuthenticationError_1 = require("../../../system/AuriaCore/exceptions/authentication/AuthenticationError");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
class PasswordAutheticator extends SystemAuthenticator_1.SystemAuthenticator {
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
        let token = jwt.sign(userAuthInfo, this.getJwtSecret(), {
            expiresIn: '2 days'
        });
        return token;
    }
    validateToken(jwtToken) {
        try {
            let jwtDecipher = jwt.verify(jwtToken, this.getJwtSecret(), { maxAge: "2 days" });
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
    authenticate(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = this.system.getSystemConnection();
            return conn
                .select("_id", "password", "user_type")
                .from("users")
                .where("username", credentials.username)
                .then((results) => __awaiter(this, void 0, void 0, function* () {
                if (results.length != 1) {
                    throw new AuthenticationError_1.AuthenticationError("Failed to authenticate user in this system!");
                }
                let userInfo = results[0];
                if (yield bcrypt.compare(credentials.password, userInfo.password)) {
                    return {
                        id: userInfo._id,
                        username: credentials.username,
                        userType: userInfo.user_type
                    };
                }
                else {
                    throw new AuthenticationError_1.AuthenticationError("Failed to authenticate user in this system!");
                }
            }));
        });
    }
}
exports.PasswordAutheticator = PasswordAutheticator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFzc3dvcmRBdXRoZW50aWNhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9zZWN1cml0eS9hdXRoL1Bhc3N3b3JkQXV0aGVudGljYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtEQUE2RjtBQUU3Riw4Q0FBMkM7QUFDM0MsaUhBQThHO0FBRTlHLCtDQUFpQztBQUNqQyxrREFBb0M7QUFFcEMsTUFBc0Isb0JBQXFCLFNBQVEseUNBQW1CO0lBRWxFLGVBQWUsQ0FBQyxJQUFnQjtRQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVZLG1CQUFtQixDQUFDLE9BQXNCOztZQUVuRCxJQUFJLFVBQVUsR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUV0RCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV6QyxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7Z0JBQ3BCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBZSxDQUFDLENBQUM7Z0JBQ3hELElBQUksYUFBYSxDQUFDLEtBQUssRUFBRTtvQkFDckIsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLFFBQVMsQ0FBQyxRQUFRLENBQUM7b0JBQ3JELElBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxRQUFTLENBQUMsY0FBYyxDQUFDO29CQUV6RCxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRTt3QkFDOUUsVUFBVSxHQUFHLElBQUks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