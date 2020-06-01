import { Module } from "../../Module.js";
import { ListenerActionsMetadata } from "../../api/ListenerAction.js";
import { ModuleListener } from "../../api/ModuleListener.js";
import { ListenerRequest } from "../../../http/request/ListenerRequest.js";
import { AuriaResponse } from "../../../http/AuriaResponse.js";
export declare class UIListener extends ModuleListener {
    constructor(module: Module);
    getMetadataFromExposedActions(): ListenerActionsMetadata;
    menuTree: (req: ListenerRequest, res: AuriaResponse) => void;
    getModulesTree: (req: ListenerRequest, res: AuriaResponse) => void;
}
