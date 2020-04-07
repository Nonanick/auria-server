import { Request } from 'express-serve-static-core';
import { RequestStack } from './RequestStack';
import { SystemUser } from '../security/SystemUser';
import { System } from '../System';
export declare class AuriaRequest {
    protected system: string;
    protected resolvedSystem: System;
    protected module: string;
    protected listener: string;
    protected action: string;
    protected request: Request;
    protected url: string;
    protected user: SystemUser;
    protected bodyData: any;
    constructor(request: Request);
    setSystem(system: System): this;
    digestUrl(): RequestStack;
    digestUser(): Promise<SystemUser>;
    getBody(): any;
    getSystemName(): string;
    getModuleName(): string;
    getListenerName(): string;
    getActionName(): string;
    getUser(): SystemUser;
    getRawRequest(): Request;
    /**
     * Get a required params, failure to fetch them from request body
     * will throw an error and script will halt!
     * A parameter MUST have a value, setting it to null is also considered
     * as empty!
     *
     * To check a flag parameter was passed use 'hasParam'!
     *
     * Flag Parameters are parameters without assigned value
     *
     * @param param Parameter name!
     */
    requiredParam(...param: string[]): any;
    reloadRequest(request: Request): void;
    getParam(name: string): any;
    hasParam(param: string): boolean;
    param(param: string): any;
    getIp(): string;
    getUserAgent(): string;
    getCookie(name: string): string;
}
