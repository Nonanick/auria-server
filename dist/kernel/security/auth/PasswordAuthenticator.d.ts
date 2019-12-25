import { SystemAuthenticator, SystemAuthenticationCredentials } from "./SystemAuthenticator";
import { SystemRequest } from "../../http/request/SystemRequest";
import { SystemUser } from "../SystemUser";
export declare abstract class PasswordAutheticator extends SystemAuthenticator {
    isAuthenticated(user: SystemUser): Promise<boolean>;
    authenticateRequest(request: SystemRequest): Promise<SystemUser>;
    /**
     * Generates an JSON Web Token to be used as an authentication by the user
     * ------------------------------------------------------------------------
     *
     * @param user
     */
    generateAuthenticationToken(user: SystemUser): string;
    private validateToken;
    authenticate(credentials: SystemAuthenticationCredentials): Promise<SystemLoginAuthDetails>;
    protected abstract getJwtSecret(): string;
}
export declare type PasswordCredentials = {
    username: string;
    password: string;
};
export declare type SystemUserAuthInfo = {
    user_id: number;
    username: string;
    loginTime: number;
    targetedSystem: string;
    systemVersion: number;
};
export declare type SystemLoginAuthDetails = {
    id: number;
    username: string;
    userType: number;
};
