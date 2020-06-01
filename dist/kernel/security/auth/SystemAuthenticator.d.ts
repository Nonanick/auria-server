import { Authenticator } from 'aurialib2';
import { SystemRequest } from '../../http/request/SystemRequest';
import { SystemUser } from '../user/SystemUser';
import { System } from '../../System';
export declare type SystemAuthenticationCredentials = {
    username: string;
    password: string;
};
export declare abstract class SystemAuthenticator implements Authenticator {
    protected system: System;
    constructor(system: System);
    abstract authenticate(credentials: SystemAuthenticationCredentials): Promise<any>;
    abstract isAuthenticated(user: SystemUser): Promise<boolean>;
    abstract authenticateRequest(request: SystemRequest): Promise<SystemUser>;
    abstract generateAuthenticationToken(user: SystemUser): string;
    abstract generateSessionToken(user: SystemUser): string;
}
