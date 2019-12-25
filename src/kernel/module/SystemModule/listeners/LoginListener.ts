import { ModuleListener, ListenerAction, ListenerActionsDefinition } from "../../ModuleListener";
import { Module } from "../../Module";
import * as jwt from 'jsonwebtoken';
import { AuthConfig } from '../../../../config/Auth';
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";
import { LoginRequest } from "../requests/LoginRequest";
import { LogoutFailed } from "../exceptions/login/LogoutFailed";
import { HandshakeFailed } from "../exceptions/login/HandshakeFailed";
import { LoginFailed } from "../exceptions/login/LoginFailed";
import { LoginAttemptManager } from "./login/LoginAttemptManager";
import { SystemUser } from "../../../security/SystemUser";

export class LoginListener extends ModuleListener {

    protected loginAttemptManager: LoginAttemptManager;

    public getRequiredRequestHandlers(): AuriaMiddleware[] {
        return [];
    }

    constructor(module: Module) {
        super(module, "LoginListener");

        this.loginAttemptManager = new LoginAttemptManager();
    }

    public getExposedActionsDefinition(): ListenerActionsDefinition {
        return {
            "login": {},
            "handshake": {},
            "keepalive": {},
            "logout": {},
        };
    }

    public login: ListenerAction = async (req) => {

        let loginReq: LoginRequest = (req as LoginRequest);
        let username: string = req.getRequiredParam('username');

        let currentAttempt = this.loginAttemptManager.requestLoginAttempt(loginReq);

        // Login with password
        if (req.hasParam('password')) {
            let password = req.getRequiredParam('password');
            return loginReq
                .loginWithPassword(username, password, loginReq)
                .then(
                    (user: SystemUser) => {
                        // Login successfull
                        currentAttempt.success = true;
                        let attempts = this.loginAttemptManager.clearLoginAttempts(loginReq);

                        return {
                            message: "Login Successful!",
                            attempts: attempts,
                            username: user.getUsername(),
                            system: req.getRequestStack().system()
                        };
                    }
                ).catch((err) => {
                    throw err;
                });
        }
        else {
            throw new LoginFailed("Insufficient parameters passed!");
        }
    };

    public logout: ListenerAction = (req) => {

        let loginReq: LoginRequest = (req as LoginRequest);

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
        } else {
            throw new LogoutFailed("Server information does not match the request");
        }

    };

}