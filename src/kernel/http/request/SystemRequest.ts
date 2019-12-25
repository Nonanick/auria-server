import { System } from '../../System';
import { RequestStack } from '../../RequestStack';
import { ServerRequest } from './ServerRequest';

export interface SystemRequest extends ServerRequest {

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

/**
 * [FACTORY] System Request
 * -------------------------
 * 
 * Factory function, will produce SystemRequest based on the 
 * > *Express **Request** object* + **System** + **RequestStack**
 * 
 */
export type SystemRequestFactoryFunction =
    (request: ServerRequest, system: System, stack: RequestStack) => SystemRequest;

export class SystemRequestFactory {

    /**
     * Factory function to be used to generate a SystemRequest
     * based on a Express Request object, the system that will 
     * be handling the request
     * 
     */
    private factoryFn: SystemRequestFactoryFunction =
        (request, system, stack) => {
            let serverRequest: SystemRequest = Object.assign(
                {
                    getSystem: () => system,
                    getSystemName: () => system.name,
                    getRequestStack: () => stack
                },
                request
            );

            return serverRequest;
        };

    public setFactoryFunction(fn: SystemRequestFactoryFunction) {
        this.factoryFn = fn;
    }

    public make(request: ServerRequest, system: System, stack: RequestStack): SystemRequest {
        return this.factoryFn(request, system, stack);
    }


}