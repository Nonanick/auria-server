import { ModuleListener } from "../../api/ModuleListener.js";
import { Module } from "../../Module.js";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { ListenerAction } from "../../api/ListenerAction.js";
export declare class TableListener extends ModuleListener {
    constructor(module: Module);
    getMetadataFromExposedActions(): AuriaListenerActionMetadata;
    metadata: ListenerAction;
}
