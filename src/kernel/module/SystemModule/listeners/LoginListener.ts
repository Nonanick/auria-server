import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginAttemptManager } from './actions/login/LoginAttemptManager.js';
import { Module } from '../../Module.js';
import { AuriaListenerActionMetadata } from '../../../../default/module/listener/AuriaListenerActionMetadata.js';
import { LoginActionMetadata } from './actions/login/LoginActionDefinition.js';
import { LogoutActionMetadata } from './actions/logout/LogoutActionDefinition.js';
import { Auria_ENV } from '../../../../AuriaServer.js';
import { LoginRequest } from '../requests/LoginRequest.js';
import { LoginFailed } from '../exceptions/login/LoginFailed.js';
import { SystemLoginAuthDetails, PasswordAutheticator } from '../../../security/auth/PasswordAuthenticator.js';
import { LogoutFailed } from '../exceptions/login/LogoutFailed.js';
import { AuthConfig } from '../../../../config/Auth.js';
import { SessionResourceDefinition as Session } from '../../../resource/systemSchema/session/SessionResourceDefinition.js';
import { UserResourceDefinition as User } from '../../../resource/systemSchema/user/UserResourceDefinition.js';
import { ModuleListener } from '../../api/ModuleListener.js';
import { ListenerAction } from '../../api/ListenerAction.js';
import { SystemUser } from '../../../security/user/SystemUser.js';
import { HandshakeFailed } from '../exceptions/login/HandshakeFailed.js';


export class LoginListener extends ModuleListener {


    public static COOKIE_USER_NAME = "UA_USERNAME";

    public static COOKIE_SESSION_TOKEN = "UA_SESSION_TOKEN";
    public static COOKIE_ACCESS_TOKEN = "UA_ACCESS_TOKEN";


    /**
     * Amount of time required to complete
     * the login request
     */
    static LOGIN_LISTENER_DELAY_LOGIN_ATTEMPT = 1000;

    protected loginAttemptManager: LoginAttemptManager;

    constructor(module: Module) {
        super(module, "Login");

        this.loginAttemptManager = new LoginAttemptManager();
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {

        let actions: AuriaListenerActionMetadata = {
            "login": LoginActionMetadata,
            "logout": LogoutActionMetadata,
            "handshake": {
                DISABLE_BLACKLIST_RULE: true,
                DISABLE_WHITELIST_RULE: true
            }
        };

        if (Auria_ENV == "development") {

            // - HashPassword, utility to generate DB bcrypt password to be stored, exposed on DEV environments
            Object.assign(actions, {
                "hashPassword": {
                    DISABLE_BLACKLIST_RULE: true,
                    DISABLE_WHITELIST_RULE: true,
                }
            });
        }
        return actions;
    }

    /**
     * Login [Public]
     * ---------------
     * 
     * Public method login will authenticate a combination of username + password
     * and subscribe the user to the system allowing requisitions signed with said
     * user will be able to be processed
     * 
     */
    public login: ListenerAction = async (req) => {

        const loginReq: LoginRequest = (req as LoginRequest);
        const username: string = req.getRequiredParam('username');

        //# - Check if this login attempt is valid (max tries exceeded, etc...)
        const currentAttempt = this.loginAttemptManager.requestLoginAttempt(loginReq);

        // Login with password
        if (req.hasParam('password')) {

            let password = req.getRequiredParam('password');

            return this.
                __checkLoginCredentials(loginReq, username, password)
                .then(
                    authDetails => this.__subscribeUserToSystem(loginReq, authDetails)
                )
                .then(
                    _ => this.__prepareLoginResponseHeaders(loginReq, username)
                )
                .then(
                    _ => {
                        //Keep signed in?
                        if (loginReq.hasParam("keep-signed-in")) this.__saveUserSession(loginReq);
                    }
                )
                .then(
                    () => {
                        let user = req.getUser();
                        // Login successfull
                        currentAttempt.success = true;
                        let attempts = this.loginAttemptManager.clearLoginAttempts(loginReq);

                        return {
                            message: "Login Successful!",
                            attempts: attempts,
                            username: user.getUsername(),
                            system: req.getRequestStack().system()
                        };
                    })
                .catch((err) => {
                    // Login failed
                    throw err;
                });
        } else {
            throw new LoginFailed("Insufficient parameters passed!");
        }
    };

    /**
     * Check Login Credentials
     * -----------------------
     * 
     * Privatly used by public method "login", will try to authenticate
     * a combination of username + password on this system DB
     * 
     * If the combinations succeeds a resolved promise with *SystemAuthLoginDetails* is returned
     * if it fails a rejected promise is returned
     */
    private __checkLoginCredentials = (req: LoginRequest, username: string, password: string): Promise<SystemLoginAuthDetails> => {
        return req
            .getSystem()
            .getAuthenticator()
            .authenticate({
                username: username,
                password: password
            });
    };

    /**
     * Subscribe User to System
     * --------------------------
     * 
     * Creates a new *SystemUser* based on the *SystemLoginAuthDetails*
     * returned by the authentication method
     * 
     */
    private __subscribeUserToSystem = (req: LoginRequest, userInfo: SystemLoginAuthDetails) => {

        // Initialize SystemUser object
        let logInUser = new SystemUser(req.getSystem(), userInfo.username);
        logInUser.setId(userInfo.id);
        logInUser.setAccessLevel(userInfo.userType);

        //Add it to the system!
        req.getSystem().loginUser(logInUser, req);

        // Replace 'getUser' in the request object
        req.getUser = () => logInUser;

    };

    /**
     * Prepare Login Response Headers
     * -------------------------------
     * 
     * Prepare the httpOnly Cookies containing the username AND refresh token
     * in case a 'keep-signed-in' parameter was passed
     * 
     * RefreshToken will expiry after a month after login!
     * 
     */
    private __prepareLoginResponseHeaders = (req: LoginRequest, username: string) => {
        // Send back authentication token
        let token = req.getSystem().getAuthenticator().generateAuthenticationToken(req.getUser());

        req.setCookie(LoginListener.COOKIE_USER_NAME, username, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: false,
            sameSite: "strict",
            secure: true
        });

        req.getUser().setAccessToken(token);
        req.setHeader(PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME, token);
    }

    /**
     * Save User Session
     * -----------------
     * 
     * Called when the "keep-signed-in" parameter is passed with a login request
     * A new session will be stored in the DB and a httpOnly Cookie will be generated  
     * When the API need to retrieve an Access Token this method is accessed out of the SPA
     * context so the httpOnly Cookie can be passed along!
     */
    private __saveUserSession = (req: LoginRequest) => {

        let token = req.getSystem().getAuthenticator().generateSessionToken(req.getUser());

        let sessionInfo: LoginSessionInfo = {
            username: req.getUser().getUsername(),
            login_time: req.getUser().getLoginTimeAsDate(),
            machine_ip: req.getIp(),
            token: token,
            system: req.getSystem().name,
            client: 'node-server',
            user_agent: req.getUser().getUserAgent()
        };

        req.setCookie(LoginListener.COOKIE_SESSION_TOKEN, token, {
            secure: true,
            sameSite: "strict",
            httpOnly: true
        });

        req.getSystem().getSystemConnection()
            .insert(sessionInfo)
            .into(Session.tableName)
            .then((ids: number[]) => {
                console.log("[LoginRequest] Keep signed in option! Recorded in sessions! ID: ", ids);
            }).catch(error => {
                console.error("[LoginRequest] Failed to record session in database!", error);
            });
    };

    /**
     * Logout [Public]
     * ----------------
     */
    public logout: ListenerAction = (req) => {

        let loginReq: LoginRequest = (req as LoginRequest);

        let username = req.getUser().getUsername();
        let cookie = req.getCookie(LoginListener.COOKIE_USER_NAME);

        if (username == cookie) {

            this.__destroyAllCookies(loginReq);

            loginReq.getSystem().getSystemConnection()
                .update(Session.columns.Status.columnName, "inactive")
                .from(Session.tableName)
                .where(Session.columns.Username.columnName, username)
                .then((ans) => {
                    console.log("[LoginListener] Updating Session! Setting as inactive!", ans);
                })
                .catch((err) => {
                    console.error("[LoginListener] Failed to update Session status!", err);
                });

            this.module.getSystem().removeUser(username);

            return { "logout": true };
        } else {
            throw new LogoutFailed("Server information does not match the request");
        }

    };


    private __destroyAllCookies = (req: LoginRequest) => {

        let expiredDate = new Date();
        expiredDate.setTime(0);

        (req as LoginRequest).setCookie(LoginListener.COOKIE_USER_NAME, "", {
            expires: expiredDate
        });
        (req as LoginRequest).setCookie(LoginListener.COOKIE_ACCESS_TOKEN, "", {
            expires: expiredDate
        });
    };

    public handshake: ListenerAction = async (req) => {

        console.log("[Handshake] Status: ", req.cookies[LoginListener.COOKIE_SESSION_TOKEN]);
        const loginReq: LoginRequest = (req as LoginRequest);
        const sessionToken = req.cookies[LoginListener.COOKIE_SESSION_TOKEN];
        const callbackURL = req.getParam("sendBack") == "" ? "/" : req.getParam("sendBack");

        //# - Will ALWAYS redirect user, most requests are HTTP not XHR
        loginReq.writeHeader("Location", callbackURL || '/');
        loginReq.headerStatus(302);

        // # - If there's no Session token, cleanup all tokens ans redirect
        if (sessionToken == null) {
            this.__destroyAllCookies(loginReq);
            return false;
        } else {
            // Check session
            let info: LoginSessionInfo;

            try {
                info = this.__checkSessionTokenPayload(sessionToken);
                // Will throw an error if it does not!
                this.__checkSessionSender(loginReq, info);
            } catch (err) {
                this.__destroyAllCookies(loginReq);
                throw new HandshakeFailed("Failed to verify token signature!");
            }

            console.log("[LoginListener] Handshake Token Info!", info);

            let verifyDb = await this.__verifyDatabaseSessionToken(loginReq, info, sessionToken);
            if (verifyDb) {
                //# - Session token is valid but user is not "logged in"
                if (!loginReq.getSystem().isUserLoggedIn(info.username)) {
                    try {
                        await loginReq.getSystem().getSystemConnection()
                            .select(
                                User.columns.ID.columnName,
                                User.columns.UserPrivilege.columnName
                            )
                            .from(User.tableName)
                            .where(User.columns.Username.columnName, info.username)
                            .then((res) => {
                                if (res.length != 1) {
                                    throw new HandshakeFailed("Failed to pinpoint user!");
                                }
                                let userInfo = res[0];
                                this.__subscribeUserToSystem(loginReq, {
                                    id: userInfo[User.columns.ID.columnName],
                                    username: info.username,
                                    userType: userInfo[User.columns.UserPrivilege.columnName]
                                });
                            })
                            .catch((err) => {
                                console.error("[LoginListener] Handshake! Failed to login user from session!", err);
                                throw new HandshakeFailed("Failed to recognize user!");
                            });
                    } catch (err) {
                        this.__destroyAllCookies(loginReq);
                        console.error("[LoginListener] Failed to retrieve information from user! Could not login from session handshake");
                        throw new HandshakeFailed("Failed to login user into the system!");
                    }
                }

                let nToken = loginReq.getSystem().getAuthenticator().generateAuthenticationToken(req.getUser());
                req.getUser().setAccessToken(nToken);
                console.log("[LoginListener] Handshake suceeded! Will now generate token!", nToken);

                loginReq.setCookie(LoginListener.COOKIE_ACCESS_TOKEN, nToken, {
                    secure: true,
                    sameSite: true,
                    httpOnly: false,
                });

                return true;
            } else {
                console.log("[LoginListener] Failed to verify session token with DB token!");
            }
        }

        return false;
    };

    private __checkSessionTokenPayload(token: string): LoginSessionInfo {
        const sessionInfo: LoginSessionInfo = jwt.verify(token, AuthConfig.jwtSecret) as any;
        return sessionInfo;
    }

    private __checkSessionSender(req: LoginRequest, info: LoginSessionInfo) {

        if (req.getIp() != info.machine_ip) {
            console.error("[LoginListener] Handshake Failed! Machine IP does not match!", req.getIp(), info.machine_ip);
            throw new HandshakeFailed("Invalid Session Cookie!");
        }

        if (req.getUserAgent() != info.user_agent) {
            console.error("[LoginListener] Handshake Failed! User Agent does not match!", req.getUserAgent(), info.user_agent);
            throw new HandshakeFailed("Invalid Session Cookie");
        }

        return true;

    }

    private async __verifyDatabaseSessionToken(req: LoginRequest, info: LoginSessionInfo, sessionToken: string) {

        //# - Get last Session ordered by login time and check if the token used is the same
        return req.getSystem().getSystemConnection()
            .select(
                Session.columns.Username.columnName,
                Session.columns.Token.columnName)
            .from(Session.tableName)
            .where(Session.columns.Username.columnName, info.username)
            .where(Session.columns.Status.columnName, "active")
            .orderBy(Session.columns.LoginTime.columnName, "desc")
            .limit(1)
            .then((dbInfo) => {
                if (dbInfo.length == 1) {
                    if (dbInfo[0].token == sessionToken) {
                        console.log("[LoginListener] Last user session matched with token!", sessionToken);
                        return true;
                    } else {
                        console.log("[LoginListener] Last user session does NOT match with token!", sessionToken, dbInfo[0]);
                    }
                }
                return false;
            });
    }

    public hashPassword: ListenerAction = (req) => {

        let pass = req.getRequiredParam('password');

        return bcrypt.hash(pass, AuthConfig.bcrypt);
    };

}

export interface LoginSessionInfo {
    username: string,
    login_time: Date,
    machine_ip: string,
    token: string,
    system: string,
    client: string,
    user_agent: string;
}