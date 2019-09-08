import { ModuleListener, ListenerAction, ListenerActionsDefinition } from "../../ModuleListener";
import { Module } from "../../Module";
import { SystemUser } from "../../../security/SystemUser";
import * as jwt from 'jsonwebtoken';
import { AuthConfig } from '../../../../config/Auth';
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";

export class LoginListener extends ModuleListener {

    public getRequiredRequestHandlers(): AuriaMiddleware[] {
        return [];
    }

    constructor(module: Module) {
        super(module, "LoginListener");
    }

    public getExposedActionsDefinition(): ListenerActionsDefinition {
        return {
            "login": {},
            "handshake": {},
            "keepalive": {},
            "logout": {},
        };
    }

    public login: ListenerAction = async (req, res) => {

        let username: string = req.requiredParam('username');

        // Login with password
        if (req.hasParam('password')) {
            let password = req.requiredParam('password');
            let success: boolean =
                await req.getUser()
                    .loginWithPassword(username, password);

            if (success) {
                try {
                    let user = this.module.getSystem().getUser(username) as SystemUser;
                    user.startSession(req);
                    user.buildUser();
                    let tokenPayload = user.generateTokenPayload();
                    let jwtString = jwt.sign(tokenPayload, AuthConfig.jwtSecret, {
                        expiresIn: 60 * 60 * 24
                    });

                    res.setCookie(SystemUser.COOKIE_HANDSHAKE, jwtString);
                    res.setCookie(SystemUser.COOKIE_USERNAME, username);

                    res.addToResponse({
                        loggedIn: true
                    });
                    res.send();

                } catch (error) {
                    res.error("20001", "Failed to locate user!");
                }
            } else {
                res.error("20002", "Login attempt failed!");
            }

        }
        else {
            throw new Error("[Login] Insufficient parameters were passed!");
        }
    };

    public handshake: ListenerAction = async (req, res) => {

        let username: string = req.requiredParam('username');
        let cookieHandshake: string = req.getCookie('AURIA_UA_USERNAME');
        let handshakeToken: string = req.getCookie('AURIA_UA_HANDSHAKE');

        if (cookieHandshake != username) {
            console.log("Username [" + username + "], Cookie [" + cookieHandshake + "]");
            throw new Error("[Login] Handshake failed!");
        }

        let loggedIn = this.module.getSystem().getUser(username);
        let loginPaylodToken = jwt.verify(handshakeToken, AuthConfig.jwtSecret, {
            maxAge: "2d"
        }) as any;

        if (typeof loginPaylodToken == "string") {
            res.error("20009", "Invalid token!");
            return;
        }

        // # - Already logged in ?
        if (loggedIn != null) {
            let matchAuth = loggedIn.verifyLoginPayload(loginPaylodToken);
            if (matchAuth) {
                res.addToResponse({
                    handshake: true
                });
                res.send();
                return;
            } else {
                res.error("99","Invalid Payload, please login");
            }
        }
        // # - Not logged in
        else {
            let log = await req.getUser().loginWithPayload(loginPaylodToken);
            if (log) {
                req.getUser().buildUser();
                res.addToResponse({
                    handshake: true
                });
                res.send();
                return;
            } else {
                res.error("98","Invalid Payload, please login");
            }
        }
    };

    public logout: ListenerAction = (req, res) => {

        let username = req.requiredParam("username");
        let cookie = req.getCookie('AURIA_UA_USERNAME');
        //let handshake = req.getCookie('AURIA_UA_HANDSHAKE');

        if (username == cookie) {
            res.setCookie("AURIA_UA_USERNAME", "", -1, true);
            res.setCookie("AURIA_UA_HANDSHAKE", "", -1, true);

            this.module.getSystem().removeUser(username);

            res.addToResponse({ "logout": true });
        } else {
            res.error("20006", "Failed to log out user!");
        }

    };

}