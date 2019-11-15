import { Request } from 'express-serve-static-core';
import { RequestStack } from './RequestStack';
import { SystemUser, SystemUserPrivilege } from '../security/SystemUser';
import { System } from '../System';

export class AuriaRequest {

    protected system: string = "";

    protected resolvedSystem: System;

    protected module: string;

    protected listener: string;

    protected action: string;

    protected request: Request;

    protected url: string;

    protected user: SystemUser;

    protected bodyData: any = {};

    constructor(request: Request) {

        this.request = request;

        this.bodyData = Object.assign({}, this.request.body, this.request.query);

        let reqInfo: RequestStack = this.digestUrl();

        this.system = reqInfo.system;
        this.module = reqInfo.module;
        this.listener = reqInfo.listener;
        this.action = reqInfo.action;

    }

    public setSystem(system: System) {
        this.resolvedSystem = system;
        return this;
    }

    public digestUrl(): RequestStack {

        this.url = this.request.path;

        let urlPieces: string[] = this.url.split('/');

        let system: string = urlPieces[1] != null ? urlPieces[1] : "";
        let moduleName: string = urlPieces[2] != null ? urlPieces[2] : "";
        let listener: string = urlPieces[3] != null ? urlPieces[3] : "";
        let action: string = urlPieces[4] != null ? urlPieces[4] : "default";

        return {
            system: system,
            module: moduleName,
            listener: listener,
            action: action
        };
    }

    public async digestUser(): Promise<SystemUser> {

        let user = new SystemUser(this.resolvedSystem, "guest");
        
        // # - Dev ONLY!
        if (this.bodyData["auria-credentials"]) {
            let cred = this.bodyData["auria-credentials"];
            if (cred.username == "dev-master" && cred.token == "123456") {
                if(this.resolvedSystem.getUser("dev-master") == null) {
                    console.log("[Request-DEV]: Dev Master is not logged in yet...");
                    let devMaster = new SystemUser(this.resolvedSystem, "dev-master");
                    devMaster.setAccessLevel(SystemUserPrivilege.MASTER);
                    this.resolvedSystem.addUser(devMaster);
                    user = devMaster;
                } else {
                    user = this.resolvedSystem.getUser("dev-master") as SystemUser;
                }
            }
        }

        //Cookie validation?
        let loggedUsername = this.getCookie(SystemUser.COOKIE_USERNAME) as string;
        let loggedHandshake = this.getCookie(SystemUser.COOKIE_HANDSHAKE) as string;
        
        //console.log("[Request-Cookies]: Username:'" + loggedUsername + "'\nHandshake: '" + loggedHandshake + "'");

        if (loggedUsername != "" && loggedHandshake != "") {
            let cookieUser = await this.validateCookieAuthentication(loggedUsername, loggedHandshake);
            if (cookieUser != null) {
                user = cookieUser;
            }
        }
        user.setUserAgent(this.getUserAgent());
        user.setIp(this.getIp());

        this.user = user;

        return user;
    }

    private async validateCookieAuthentication(username: string, handshake: string): Promise<SystemUser | null> {

        let loggedUser: SystemUser | null = this.resolvedSystem.getUser(username);
        // # - Is logged into the system?
        if (loggedUser != null) {
            let validHandshake = await loggedUser.validateHandshake(this, handshake);
            if (validHandshake) {
                return loggedUser;
            } else {
                console.error("[AuriaRequest] Invalid handshake, failed to authenticate user");
            }
        } else {
            console.error("[AuriaRequest] User requested is not logged in!", username);
        }

        return null;
    }

    public getBody() {
        return this.bodyData;
    }

    public getSystemName(): string {
        return this.system;
    }

    public getModuleName(): string {
        return this.module;
    }

    public getListenerName(): string {
        return this.listener;
    }

    public getActionName(): string {
        return this.action;
    }
    
    public getUser(): SystemUser {
        return this.user;
    }

    public getRawRequest() : Request {
        return this.request;
    }
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
    public requiredParam(...param: string[]): any {

        let properAns: string | { [param: string]: string } = {};

        this.bodyData = Object.assign({}, this.request.body, this.request.query);

        param.forEach((p: string) => {
            if (this.bodyData[p] != null) {
                if (param.length == 1) {
                    properAns = this.bodyData[p];
                } else {
                    (properAns as any)[p] = this.bodyData[p];
                }
            } else {
                console.error("[AuriaRequest] Failed to proccess request, parameter '" + p + "' was not provided!");
                throw new Error("Wrong request, a required parameter was not provided!");
            }
        });

        return properAns;
    }
    public reloadRequest(request : Request ) {
        this.request = request;
    }

    public getParam(name: string): any {

        if (this.bodyData[name] == null) {
            return "";
        } else {
            return this.bodyData[name];
        }
    }

    public hasParam(param: string): boolean {
        return this.bodyData[param] !== undefined;
    }

    public param(param: string): any {
        return this.getParam(param);
    }

    public getIp() {
        return this.request.ip;
    }

    public getUserAgent() {
        return this.request.headers['user-agent'] as string;
    }

    public getCookie(name: string): string {
        //console.log("[Request] Get Cookie ", name ," value '", this.request.cookies[name], "'" );
        if (this.request.cookies != null){ 
            return this.request.cookies[name] == null ? "" : this.request.cookies[name];
        }
        else
            return "";
    }

}