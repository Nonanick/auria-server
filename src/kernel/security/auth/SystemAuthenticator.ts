import { Authenticator } from 'aurialib2';
import { SystemRequest } from '../../http/request/SystemRequest';
import { SystemUser } from '../SystemUser';
import { System } from '../../System';

export type SystemAuthenticationCredentials = {
    username : string;
    password : string;
};

export abstract class SystemAuthenticator implements Authenticator {
    
    protected system : System;

    constructor(system : System) {
        this.system = system;
    }
    
    abstract authenticate(credentials : SystemAuthenticationCredentials): Promise<any>;
    
    abstract isAuthenticated(user : SystemUser): Promise<boolean>;

    abstract async authenticateRequest(request : SystemRequest) : Promise<SystemUser>;

    public abstract generateAuthenticationToken(user : SystemUser) : string;

}