var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SystemAuthenticator } from './SystemAuthenticator.js';
import { SystemUser } from '../user/SystemUser.js';
import { ExpiredToken } from '../../exceptions/kernel/ExpiredToken.js';
import { UserResourceDefinition } from '../../resource/systemSchema/user/UserResourceDefinition.js';
import { UserNotLoggedIn } from '../../exceptions/kernel/UserNotLoggedIn.js';
import { AuthenticationFailed } from '../../exceptions/kernel/AuthenticationFailed.js';
let PasswordAutheticator = /** @class */ (() => {
    class PasswordAutheticator extends SystemAuthenticator {
        isAuthenticated(user) {
            throw new Error("Method not implemented.");
        }
        authenticateRequest(request) {
            return __awaiter(this, void 0, void 0, function* () {
                let systemUser = new SystemUser(this.system, "guest");
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
                                if (!systemUser.accessTokenMatch(token)) {
                                    throw new ExpiredToken("The token used is no longer associated with the user!");
                                }
                                console.log("[PasswordAuthenticator] Request Token is valid and user is logged into the system!");
                            }
                            else {
                                console.log("[PasswordAuthenticator] Request Token is valid and user is NOT logged into the system!");
                                throw new UserNotLoggedIn("The user in the token is not logged into the system!");
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
        generateSessionToken(user) {
            const uniqueSessionIdentifier = nanoid();
            let sessionInfo = {
                machine_ip: user.getIp(),
                user_agent: user.getUserAgent(),
                loginTime: Date.now(),
                systemVersion: this.system.getSystemVersion(),
                targetedSystem: this.system.name,
                username: user.getUsername(),
                session_id: uniqueSessionIdentifier
            };
            let token = jwt.sign(sessionInfo, this.getJwtSecret(), {
                expiresIn: '30 days'
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
                    .select(UserResourceDefinition.columns.ID.columnName, UserResourceDefinition.columns.Password.columnName, UserResourceDefinition.columns.UserPrivilege.columnName)
                    .from(UserResourceDefinition.tableName)
                    .where(UserResourceDefinition.columns.Username.columnName, credentials.username)
                    .then((results) => __awaiter(this, void 0, void 0, function* () {
                    if (results.length != 1) {
                        if (results.length > 1)
                            console.error("[PasswordAuthenticator] WARNING dupped username in User Table! Authentication will fail!");
                        throw new AuthenticationFailed("Failed to authenticate user in this system!");
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
                        throw new AuthenticationFailed("Failed to authenticate user in this system!");
                    }
                }));
            });
        }
    }
    PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME = "X-Auria-Access-Token";
    return PasswordAutheticator;
})();
export { PasswordAutheticator };
