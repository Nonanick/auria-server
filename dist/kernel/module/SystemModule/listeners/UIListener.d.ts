import { ModuleListener } from "../../ModuleListener";
import { AuriaResponse } from "../../../http/AuriaResponse";
import { Module } from "../../Module";
import { ListenerRequest } from "../../../http/request/ListenerRequest";
import { ListenerActionsMetadata } from "../../ListenerAction";
export declare class UIListener extends ModuleListener {
    constructor(module: Module);
    getExposedActionsMetadata(): ListenerActionsMetadata;
    menuTree: (req: ListenerRequest, res: AuriaResponse) => void;
    getModulesTree: (req: ListenerRequest, res: AuriaResponse) => void;
}
