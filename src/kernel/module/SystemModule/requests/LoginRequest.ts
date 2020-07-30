
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

    getSystem: () => System;

}

/**
 * Login Request Factory
 * ----------------------
 * Extends an ModuleRequest object adding some functions necessary for the Login
 * Listener routines
 */
export class LoginRequestFactory {

    public static make(request: ModuleRequest, system: System) {

        return Object.assign({}, request, {
            getSystem: _ => system,
        });
    }
}