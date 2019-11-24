import { SystemAuthenticator } from "../../security/auth/SystemAuthenticator";
import { SystemRequest } from "../../http/request/SystemRequest";
import { SystemUser } from "../../security/SystemUser";

export class AuriaSystemAuthenticator extends SystemAuthenticator {

    authenticate(user: SystemUser): Promise<any> {
        throw new Error("Method not implemented.");
    }

    isAuthenticated(user: SystemUser): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async digestUser(request: SystemRequest): Promise<SystemUser> {
        
        let user = new SystemUser(request.getSystem(), "guest");


        return user;

    }

}