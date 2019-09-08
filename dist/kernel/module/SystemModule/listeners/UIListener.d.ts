import { ModuleListener, ListenerActionsDefinition } from "../../ModuleListener";
import { AuriaRequest } from "../../../http/AuriaRequest";
import { AuriaResponse } from "../../../http/AuriaResponse";
import { Module } from "../../Module";
export declare class UIListener extends ModuleListener {
    getRequiredRequestHandlers(): import("../../../http/AuriaMiddleware").AuriaMiddleware[];
    constructor(module: Module);
    getExposedActionsDefinition(): ListenerActionsDefinition;
    menuTree: (req: AuriaRequest, res: AuriaResponse) => void;
    getModulesTree: (req: AuriaRequest, res: AuriaResponse) => void;
}
