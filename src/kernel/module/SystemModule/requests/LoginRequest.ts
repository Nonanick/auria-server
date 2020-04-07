import { ListenerRequest } from "../../../http/request/ListenerRequest";
import { CookieOptions } from "express-serve-static-core";
import { ModuleRequest } from "../../../http/request/ModuleRequest";
import { Response } from "express";
import { System } from "../../../System";
import { SystemUser } from "../../../security/SystemUser";
import { SystemLoginAuthDetails, PasswordAutheticator } from '../../../security/auth/PasswordAuthenticator';

export interface LoginRequest extends ListenerRequest {

    setCookie: (name: string, value: string, options: CookieOptions) => void;

    /**
     * 
     */
    loginWithPassword: (username: string, password: string, loginRequest: LoginRequest) => Promise<SystemUser>;

}

export class LoginRequestFactory {

    public static make(request: ModuleRequest, response: Response, system: System) {

        return Object.assign({}, request, {

            setCookie: (name: string, value: string, options: CookieOptions) => {
                return response.cookie(name, value, options);
            },

            loginWithPassword: async (username: string, password: string, request: LoginRequest) => {

                return system
                    .getAuthenticator()
                    .authenticate({
                        username: username,
                        password: password
                    })
                    .then((authDetails: SystemLoginAuthDetails) => {

                        // Initialize SystemUser object
                        let logInUser = new SystemUser(system, username);
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
                        response.setHeader(PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME, token);

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
                                .then((ids: number[]) => {
                                    console.log("[LoginRequest] Keep signed in option! Recorded in sessions! ID: ", ids);
                                }).catch(error => {
                                    console.error("[LoginRequest] Failed to record session in database!", error);
                                });
                        }
                        return logInUser;
                    });

            }
        });
    }
}