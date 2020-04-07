import { System } from "../System";
import { SystemUser } from "./SystemUser";
import { Module } from "../module/Module";
import { ModuleListener } from "../module/ModuleListener";
import { UserAccessTree } from "./UserAccessTree";
import { AuriaResponse } from "../http/AuriaResponse";
import { ModuleRequest } from "../http/request/ModuleRequest";
export declare abstract class AccessManager {
    protected system: System;
    protected module: Module;
    protected listener: ModuleListener;
    protected action: (req: ModuleRequest, res: AuriaResponse) => void;
    protected user: SystemUser;
    constructor(system: System);
    setUser(user: SystemUser): void;
    getModule(): Module;
    getListener(): ModuleListener;
    getListenerAction(): (req: ModuleRequest, res: AuriaResponse) => any;
    abstract validateUser(user: SystemUser): boolean;
    abstract canAccessRequest(request: ModuleRequest): boolean;
    loadRequestStack(request: ModuleRequest): void;
    abstract getUserAccessTree(): UserAccessTree;
}
