import { SystemAuthenticator, SystemAuthenticationCredentials } from './SystemAuthenticator.js';
import { SystemUser } from '../user/SystemUser.js';
import { SystemRequest } from '../../http/request/SystemRequest.js';
export declare abstract class PasswordAutheticator extends SystemAuthenticator {
    static AUTHENTICATOR_JWT_HEADER_NAME: string;
    isAuthenticated(user: SystemUser): Promise<boolean>;
    authenticateRequest(request: SystemRequest): Promise<SystemUser>;
    /**
     * Generates an JSON Web Token to be used as an authentication by the user
     * ------------------------------------------------------------------------
     *
     * @param user
     */
    generateAuthenticationToken(user: SystemUser): string;
    generateSessionToken(user: SystemUser): string;
    validateToken(jwtToken: string): ValidateTokenInfo;
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
declare type ValidateTokenInfo = {
    valid: boolean;
    authInfo: undefined | SystemUserAuthInfo;
};
export {};
