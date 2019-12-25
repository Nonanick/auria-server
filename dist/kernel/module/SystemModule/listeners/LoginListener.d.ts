import { ModuleListener, ListenerAction, ListenerActionsDefinition } from "../../ModuleListener";
import { Module } from "../../Module";
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";
import { LoginAttemptManager } from "./login/LoginAttemptManager";
export declare class LoginListener extends ModuleListener {
    protected loginAttemptManager: LoginAttemptManager;
    getRequiredRequestHandlers(): AuriaMiddleware[];
    constructor(module: Module);
    getExposedActionsDefinition(): ListenerActionsDefinition;
    login: ListenerAction;
    logout: ListenerAction;
}
