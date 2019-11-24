import { Request } from 'express-serve-static-core';
import { System } from '../../System';
import { SystemUnavaliable } from '../../exceptions/kernel/SystemUnavaliable';
import { RequestStack } from '../../RequestStack';


export interface SystemRequest extends Request {

    /**
     * [GET] System
     * -------------
     * 
     * Return the requested system object
     * 
     */
    getSystem: () => System;

    /**
     * [GET] System Name
     * -----------------
     * 
     * Returns the name of the request system
     */
    getSystemName: () => String;

    /**
     * [GET] Request Stack
     * --------------------
     * 
     * Return the requested URL stack
     * The URL is expected to be in the following format:
     * 
     * ${SystemName}/${ModuleName}/${ListenerName}/${ActionName} 
     * 
     * Any further information passed through GET or POST will be passed
     * as parameters to the Action function and be accessible in the Request 
     * object
     */
    getRequestStack: () => RequestStack;

}

export class SystemRequestFactory {

    public static make(request: Request, system: System, stack : RequestStack): SystemRequest {

        let serverRequest : SystemRequest = Object.assign(
            {
                getSystem : () => system,
                getSystemName : () => system.name,
                getRequestStack : () => stack
            },
            request
        );

        return serverRequest;

    }

   
}