import { ModuleListener } from "../../ModuleListener";
import { Module } from "../../Module";
import { ListenerAction } from "../../ListenerAction";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata";
export declare class TableListener extends ModuleListener {
    constructor(module: Module);
    getExposedActionsMetadata(): AuriaListenerActionMetadata;
    metadata: ListenerAction;
}
