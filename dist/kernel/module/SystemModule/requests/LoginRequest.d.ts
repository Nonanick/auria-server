import { ListenerRequest } from "../../../http/request/ListenerRequest";
import { CookieOptions } from "express-serve-static-core";
import { ModuleRequest } from "../../../http/request/ModuleRequest";
import { Response } from "express";
import { System } from "../../../System";
import { SystemUser } from "../../../security/SystemUser";
export interface LoginRequest extends ListenerRequest {
    setCookie: (name: string, value: string, options: CookieOptions) => void;
    /**
     *
     */
    loginWithPassword: (username: string, password: string, loginRequest: LoginRequest) => Promise<SystemUser>;
}
export declare class LoginRequestFactory {
    static make(request: ModuleRequest, response: Response, system: System): ModuleRequest & {
        setCookie: (name: string, value: string, options: CookieOptions) => Response;
        loginWithPassword: (username: string, password: string, request: LoginRequest) => Promise<SystemUser>;
    };
}
