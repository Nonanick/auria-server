import { System } from "../System";
import { SystemUser } from "./SystemUser";
import { AuriaRequest } from "../http/AuriaRequest";
import { Module } from "../module/Module";
import { ModuleListener } from "../module/ModuleListener";
import { UserAccessTree } from "./UserAccessTree";
import { AuriaResponse } from "../http/AuriaResponse";

export abstract class AccessManager {

    protected system: System;

    protected module: Module;

    protected listener: ModuleListener;

    protected action: (req: AuriaRequest, res: AuriaResponse) => void;

    protected user: SystemUser;

    constructor(system: System) {
        this.system = system;
    }

    public setUser(user: SystemUser) {
        this.user = user;
    }

    public getModule(): Module {
        return this.module;
    }

    public getListener(): ModuleListener {
        return this.listener;
    }

    public getListenerAction(): (req: AuriaRequest, res: AuriaResponse) => any {
        return this.action;
    }

    public abstract validateUser(user: SystemUser): boolean;

    public abstract canAccessRequest(request: AuriaRequest): boolean;

    public loadRequestStack(request: AuriaRequest): void {

        if (!this.system.hasModule(request.getModuleName())) {
            throw new Error("Module does not exist in this system!");
        }

        let mod = this.system.getModule(request.getModuleName());
        if (mod != null) {

            this.module = mod;

            if (!mod.hasListener(request.getListenerName()) && !mod.hasListener(request.getListenerName() + "Listener")) {
                throw new Error("Listener does not exist in this module");
            }

            let list = mod.getListener(request.getListenerName()) == null ?
                mod.getListener(request.getListenerName() + "Listener") :
                mod.getListener(request.getListenerName());

            if (list == null) {
                throw new Error("Listener unavaliable in this module");
            }

            this.listener = list;
            console.log("Listener have action?", request.getActionName(), list.hasOwnProperty(request.getActionName()));

            if (list.hasOwnProperty(request.getActionName())) {
                let fn = (list as any)[request.getActionName()];
                this.action = fn;
            } else {
                throw new Error("This action is not exposed by this listener!");
            }
        } else {
            throw new Error("Module is not avaliable in this system");
        }
    }

    public abstract getUserAccessTree(): UserAccessTree;
}