import { CookieOptions } from "express-serve-static-core";
import { Response } from "express";
import { ListenerRequest } from "../../../http/request/ListenerRequest.js";
import { System } from "../../../System.js";
import { ModuleRequest } from "../../../http/request/ModuleRequest.js";
/**
 * Login Request
 * --------------
 * An extension of the Express Request Object crafted for the Login Listener routines
 * Exposes some methods usually not avaliable to all ListenerActions
 */
export interface LoginRequest extends ListenerRequest {
    setCookie: (name: string, value: string, options: CookieOptions) => void;
    setHeader: (name: string, value: string) => void;
    getSystem: () => System;
    writeHeader: (key: string, value: string) => void;
    headerStatus: (code: number) => void;
}
/**
 * Login Request Factory
 * ----------------------
 * Extends an ModuleRequest object adding some functions necessary for the Login
 * Listener routines
 */
export declare class LoginRequestFactory {
    static make(request: ModuleRequest, response: Response, system: System): ModuleRequest & {
        setCookie: (name: string, value: string, options: CookieOptions) => Response<any>;
        getSystem: (_: any) => System;
        setHeader: (key: any, value: any) => void;
        writeHeader: (key: any, value: any) => Response<any>;
        headerStatus: (code: number) => Response<any>;
    };
}
