import { SystemRequest } from "./SystemRequest.js";import { SystemUser } from "../../security/user/SystemUser.js";import { Module } from "../../module/Module.js";

export interface ModuleRequest extends SystemRequest {
    getUser: () => SystemUser;
}

export type ModuleRequestFactoryFunction = (request: SystemRequest, user: SystemUser, module: Module) => ModuleRequest;

export class ModuleRequestFactory {

    public static setFactoryFunction(fn: ModuleRequestFactoryFunction) {

        ModuleRequestFactory.factoryFn = fn;

    }

    private static factoryFn: ModuleRequestFactoryFunction = (request, user, module) => {
        return Object.assign(
            {
                getUser: () => user,
                getModule: () => module
            },
            request
        );
    };

    public static make(request: SystemRequest, user: SystemUser, module: Module): ModuleRequest {
        return ModuleRequestFactory.factoryFn(request, user, module);
    }
}