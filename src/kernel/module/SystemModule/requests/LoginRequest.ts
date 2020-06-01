
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
export class LoginRequestFactory {

    public static make(request: ModuleRequest, response: Response, system: System) {

        return Object.assign({}, request, {

            setCookie: (name: string, value: string, options: CookieOptions) => {
                return response.cookie(name, value, options);
            },
            getSystem: _ => system,
            setHeader: (key, value) => response.setHeader(key, value),
            writeHeader: (key, value) => response.set(key, value),
            headerStatus: (code: number) => response.status(code),
        });
    }
}