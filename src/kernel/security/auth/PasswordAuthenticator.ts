import { nanoid } from 'nanoid';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SystemAuthenticator, SystemAuthenticationCredentials } from './SystemAuthenticator.js';
import { SystemUser } from '../user/SystemUser.js';
import { SystemRequest } from '../../http/request/SystemRequest.js';
import { ExpiredToken } from '../../exceptions/kernel/ExpiredToken.js';
import { UserResourceDefinition } from '../../resource/systemSchema/user/UserResourceDefinition.js';
import { UserNotLoggedIn } from '../../exceptions/kernel/UserNotLoggedIn.js';
import { AuthenticationFailed } from '../../exceptions/kernel/AuthenticationFailed.js';

export abstract class PasswordAutheticator extends SystemAuthenticator {

    public static AUTHENTICATOR_JWT_HEADER_NAME = "X-Auria-Access-Token";

    isAuthenticated(user: SystemUser): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async authenticateRequest(request: SystemRequest): Promise<SystemUser> {

        let systemUser = new SystemUser(this.system, "guest");

        let token = request.headers[
            // Express convert headers to lowercase!
            PasswordAutheticator.AUTHENTICATOR_JWT_HEADER_NAME.toLowerCase()
        ];

        if (token != undefined) {
            let validateToken = this.validateToken(token as string);
            if (validateToken.valid) {
                let tokenUsername = validateToken.authInfo!.username;
                let tokenSystem = validateToken.authInfo!.targetedSystem;

                if (tokenSystem == this.system.name) {
                    if (this.system.isUserLoggedIn(tokenUsername)) {
                        systemUser = this.system.getUser(tokenUsername)!;
                        if (!systemUser.accessTokenMatch(token)) {
                            throw new ExpiredToken("The token used is no longer associated with the user!");
                        }
                        console.log("[PasswordAuthenticator] Request Token is valid and user is logged into the system!");
                    } else {
                        console.log("[PasswordAuthenticator] Request Token is valid and user is NOT logged into the system!");
                        throw new UserNotLoggedIn("The user in the token is not logged into the system!");
                    }
                } else {
                    console.log("[PasswordAuthenticator] Invalid token!");
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

    public generateSessionToken(user: SystemUser): string {
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

        let token = jwt.sign(
            sessionInfo,
            this.getJwtSecret(),
            {
                expiresIn: '30 days'
            }
        );

        return token;
    }

    public validateToken(jwtToken: string): ValidateTokenInfo {
        try {
            let jwtDecipher: SystemUserAuthInfo;
            jwtDecipher = jwt.verify(jwtToken, this.getJwtSecret(), { maxAge: "2 days" }) as any;
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
            .select(
                UserResourceDefinition.columns.ID.columnName,
                UserResourceDefinition.columns.Password.columnName,
                UserResourceDefinition.columns.UserPrivilege.columnName
            )
            .from(UserResourceDefinition.tableName)
            .where(UserResourceDefinition.columns.Username.columnName, credentials.username)
            .then(
                async (results: QueryResultUserLoginWithPassword[]) => {

                    if (results.length != 1) {
                        if (results.length > 1) console.error("[PasswordAuthenticator] WARNING dupped username in User Table! Authentication will fail!");
                        throw new AuthenticationFailed("Failed to authenticate user in this system!");
                    }

                    let userInfo = results[0];
                    if (await bcrypt.compare(credentials.password, userInfo.password)) {
                        return {
                            id: userInfo._id,
                            username: credentials.username,
                            userType: userInfo.user_privilege
                        };
                    } else {
                        throw new AuthenticationFailed("Failed to authenticate user in this system!");
                    }
                }
            );
    }

    protected abstract getJwtSecret(): string;


}

export type PasswordCredentials = {
    username: string;
    password: string;
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
    user_privilege: number;
};