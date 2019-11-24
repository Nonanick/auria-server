import { Authenticator } from 'aurialib2';
import { SystemRequest } from '../../http/request/SystemRequest';
import { SystemUser } from '../SystemUser';
export declare abstract class SystemAuthenticator implements Authenticator {
    abstract authenticate(user: SystemUser): Promise<any>;
    abstract isAuthenticated(user: SystemUser): Promise<boolean>;
    abstract digestUser(request: SystemRequest): Promise<SystemUser>;
}
