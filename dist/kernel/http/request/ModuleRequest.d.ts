import { SystemRequest } from "./SystemRequest.js";
import { SystemUser } from "../../security/user/SystemUser.js";
import { Module } from "../../module/Module.js";
export interface ModuleRequest extends SystemRequest {
    getUser: () => SystemUser;
}
export declare type ModuleRequestFactoryFunction = (request: SystemRequest, user: SystemUser, module: Module) => ModuleRequest;
export declare class ModuleRequestFactory {
    static setFactoryFunction(fn: ModuleRequestFactoryFunction): void;
    private static factoryFn;
    static make(request: SystemRequest, user: SystemUser, module: Module): ModuleRequest;
}
