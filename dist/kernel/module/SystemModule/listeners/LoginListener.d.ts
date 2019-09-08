import { ModuleListener, ListenerAction, ListenerActionsDefinition } from "../../ModuleListener";
import { Module } from "../../Module";
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";
export declare class LoginListener extends ModuleListener {
    getRequiredRequestHandlers(): AuriaMiddleware[];
    constructor(module: Module);
    getExposedActionsDefinition(): ListenerActionsDefinition;
    login: ListenerAction;
    handshake: ListenerAction;
    logout: ListenerAction;
}
