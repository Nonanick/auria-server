import { SystemAuthenticator } from "../../security/auth/SystemAuthenticator";
import { SystemRequest } from "../../http/request/SystemRequest";
import { SystemUser } from "../../security/SystemUser";
import { System } from "../../System";
import { AuthConfigType } from "../../../config/Auth";
export declare type UserAuthInfo = {
    user_id: number;
    username: string;
    loginTime: number;
    targetedSystem: string;
    systemVersion: number;
};
export declare class AuriaSystemAuthenticator extends SystemAuthenticator {
    protected jwtConfig: AuthConfigType;
    constructor(system: System);
    authenticate(user: SystemUser): Promise<any>;
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
}
