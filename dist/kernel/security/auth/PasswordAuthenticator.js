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
const UserNotLoggedIn_1 = require("../../exceptions/kernel/UserNotLoggedIn");
class PasswordAutheticator extends SystemAuthenticator_1.SystemAuthenticator {
    isAuthenticated(user) {
        throw new Error("Method not implemented.");
    }
    authenticateRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let systemUser = new SystemUser_1.SystemUser(this.system, "guest");
            let token = request.headers[
            // Express convert headers to lowercase!
            PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME.toLowerCase()];
            if (token != undefined) {
                let validateToken = this.validateToken(token);
                if (validateToken.valid) {
                    let tokenUsername = validateToken.authInfo.username;
                    let tokenSystem = validateToken.authInfo.targetedSystem;
                    if (tokenSystem == this.system.name) {
                        if (this.system.isUserLoggedIn(tokenUsername)) {
                            systemUser = this.system.getUser(tokenUsername);
                            console.log("[PasswordAuthenticator] Request Token is valid and user is logged into the system!");
                        }
                        else {
                            console.log("[PasswordAuthenticator] Request Token is valid and user is NOT logged into the system!");
                            throw new UserNotLoggedIn_1.UserNotLoggedIn("The user in the token is not logged into the system!");
                        }
                    }
                    else {
                        console.log("[PasswordAuthenticator] Invalid token!");
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
            let jwtDecipher;
            jwtDecipher = jwt.verify(jwtToken, this.getJwtSecret(), { maxAge: "2 days" });
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
PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME = "X-Auria-Access-Token";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFzc3dvcmRBdXRoZW50aWNhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9zZWN1cml0eS9hdXRoL1Bhc3N3b3JkQXV0aGVudGljYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrREFBNkY7QUFFN0YsOENBQTJDO0FBQzNDLGlIQUE4RztBQUU5RywrQ0FBaUM7QUFDakMsa0RBQW9DO0FBQ3BDLDZFQUEwRTtBQUUxRSxNQUFzQixvQkFBcUIsU0FBUSx5Q0FBbUI7SUFJbEUsZUFBZSxDQUFDLElBQWdCO1FBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRVksbUJBQW1CLENBQUMsT0FBc0I7O1lBRW5ELElBQUksVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXRELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPO1lBQ3ZCLHdDQUF3QztZQUN4QyxvQkFBb0IsQ0FBQyw2QkFBNkIsQ0FBQyxXQUFXLEVBQUUsQ0FDbkUsQ0FBQztZQUVGLElBQUksS0FBSyxJQUFJLFNBQVMsRUFBRTtnQkFDcEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFlLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFO29CQUNyQixJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsUUFBUyxDQUFDLFFBQVEsQ0FBQztvQkFDckQsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLFFBQVMsQ0FBQyxjQUFjLENBQUM7b0JBRXpELElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO3dCQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFOzRCQUMzQyxV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