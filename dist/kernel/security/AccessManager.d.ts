import { System } from "../System";
import { SystemUser } from "./SystemUser";
import { AuriaRequest } from "../http/AuriaRequest";
import { Module } from "../module/Module";
import { ModuleListener } from "../module/ModuleListener";
import { UserAccessTree } from "./UserAccessTree";
import { AuriaResponse } from "../http/AuriaResponse";
export declare abstract class AccessManager {
    protected system: System;
    protected module: Module;
    protected listener: ModuleListener;
    protected action: (req: AuriaRequest, res: AuriaResponse) => void;
    protected user: SystemUser;
    constructor(system: System);
    setUser(user: SystemUser): void;
    getModule(): Module;
    getListener(): ModuleListener;
    getListenerAction(): (req: AuriaRequest, res: AuriaResponse) => any;
    abstract validateUser(user: SystemUser): boolean;
    abstract canAccessRequest(request: AuriaRequest): boolean;
    loadRequestStack(request: AuriaRequest): void;
    abstract getUserAccessTree(): UserAccessTree;
}
