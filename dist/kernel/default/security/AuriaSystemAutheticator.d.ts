import { SystemAuthenticator } from "../../security/auth/SystemAuthenticator";
import { SystemRequest } from "../../http/request/SystemRequest";
import { SystemUser } from "../../security/SystemUser";
export declare class AuriaSystemAuthenticator extends SystemAuthenticator {
    authenticate(user: SystemUser): Promise<any>;
    isAuthenticated(user: SystemUser): Promise<boolean>;
    digestUser(request: SystemRequest): Promise<SystemUser>;
}
