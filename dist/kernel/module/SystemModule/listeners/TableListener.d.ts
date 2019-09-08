import { ModuleListener, ListenerAction, ListenerActionsDefinition } from "../../ModuleListener";
import { Module } from "../../Module";
import { AuriaMiddleware } from "../../../http/AuriaMiddleware";
export declare class TableListener extends ModuleListener {
    getRequiredRequestHandlers(): AuriaMiddleware[];
    constructor(module: Module);
    getExposedActionsDefinition(): ListenerActionsDefinition;
    metadata: ListenerAction;
}
