import { ModuleListener } from "../../ModuleListener";
import { Module } from "../../Module";
import { LoginRequest } from "../requests/LoginRequest";
import { LogoutFailed } from "../exceptions/login/LogoutFailed";
import { LoginFailed } from "../exceptions/login/LoginFailed";
import { LoginAttemptManager } from "./actions/login/LoginAttemptManager";
import { SystemUser } from "../../../security/SystemUser";
import { ListenerAction } from "../../ListenerAction";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata";
// # - Login Action Metadata
import { LoginActionMetadata } from "./actions/login/LoginActionDefinition";
import { LogoutActionMetadata } from "./actions/logout/LogoutActionDefinition";

export class LoginListener extends ModuleListener {

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

    public getExposedActionsMetadata(): AuriaListenerActionMetadata {
        return {
            "login": LoginActionMetadata,
            "logout": LogoutActionMetadata,
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