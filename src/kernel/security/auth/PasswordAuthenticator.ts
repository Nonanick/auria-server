import { SystemAuthenticator, SystemAuthenticationCredentials } from "./SystemAuthenticator";
import { SystemRequest } from "../../http/request/SystemRequest";
import { SystemUser } from "../SystemUser";
import { AuthenticationError } from "../../../system/AuriaCore/exceptions/authentication/AuthenticationError";

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export abstract class PasswordAutheticator extends SystemAuthenticator {

    isAuthenticated(user: SystemUser): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async authenticateRequest(request: SystemRequest): Promise<SystemUser> {

        let systemUser = new SystemUser(this.system, "guest");

        let token = request.headers['auria-access-token'];

        console.log("User Access Token:", token);

        if (token != undefined) {
            let validateToken = this.validateToken(token as string);
            if (validateToken.valid) {
                let tokenUsername = validateToken.authInfo!.username;
                let tokenSystem = validateToken.authInfo!.targetedSystem;

                if (tokenSystem == this.system.name && this.system.isUserLoggedIn(tokenUsername)) {
                    systemUser = this.system.getUser(tokenUsername)!;

                    console.log("[CoreAuthenticator] Request Token is valid and user is logged into the system!");
                }
            }
        }
        return systemUser;
    }

    /**
     * Generates an JSON Web Token to be used as an authentication by the user
     * ------------------------------------------------------------------------
     * 
     * @param user 
     */
    public generateAuthenticationToken(user: SystemUser): string {

        let userAuthInfo: SystemUserAuthInfo = {
            loginTime: Date.now(),
            systemVersion: this.system.getSystemVersion(),
            targetedSystem: this.system.name,
            username: user.getUsername(),
            user_id: user.getId()
        };

        let token = jwt.sign(
            userAuthInfo,
            this.getJwtSecret(),
            {
                expiresIn: '2 days'
            }
        );

        return token;
    }

    private validateToken(jwtToken: string): ValidateTokenInfo {
        try {
            let jwtDecipher: SystemUserAuthInfo = jwt.verify(jwtToken, this.getJwtSecret(), { maxAge: "2 days" }) as any;

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

    public async authenticate(credentials: SystemAuthenticationCredentials): Promise<SystemLoginAuthDetails> {

        let conn = this.system.getSystemConnection();

        return conn
            .select("_id", "password", "user_type")
            .from("users")
            .where("username", credentials.username)
            .then(
                async (results: QueryResultUserLoginWithPassword[]) => {

                    if (results.length != 1) {
                        throw new AuthenticationError("Failed to authenticate user in this system!");
                    }

                    let userInfo = results[0];
                    if (await bcrypt.compare(credentials.password, userInfo.password)) {
                        return {
                            id: userInfo._id,
                            username: credentials.username,
                            userType: userInfo.user_type
                        };
                    } else {
                        throw new AuthenticationError("Failed to authenticate user in this system!");
                    }
                }
            );
    }

    protected abstract getJwtSecret() : string;


}

export type PasswordCredentials = {
    username : string;
    password : string;
};

export type SystemUserAuthInfo = {
    user_id: number;
    username: string;
    loginTime: number;
    targetedSystem: string;
    systemVersion: number;
};

export type SystemLoginAuthDetails = {
    id: number;
    username: string;
    userType: number;
}

type ValidateTokenInfo = {
    valid: boolean;
    authInfo: undefined | SystemUserAuthInfo;
}

type QueryResultUserLoginWithPassword = {
    _id: number;
    password: string;
    user_type: number;
};