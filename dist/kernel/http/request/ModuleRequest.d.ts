import { SystemRequest } from "./SystemRequest";
import { SystemUser } from "../../security/SystemUser";
import { Module } from "../../module/Module";
export interface ModuleRequest extends SystemRequest {
    getUser: () => SystemUser;
}
export declare type ModuleRequestFactoryFunction = (request: SystemRequest, user: SystemUser, module: Module) => ModuleRequest;
export declare class ModuleRequestFactory {
    static setFactoryFunction(fn: ModuleRequestFactoryFunction): void;
    private static factoryFn;
    static make(request: SystemRequest, user: SystemUser, module: Module): ModuleRequest;
}
