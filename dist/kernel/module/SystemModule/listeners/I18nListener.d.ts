import { Module } from "../../Module.js";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { ModuleListener } from "../../api/ModuleListener.js";
import { ListenerAction } from "../../api/ListenerAction.js";
export declare class I18nListener extends ModuleListener {
    constructor(module: Module);
    getMetadataFromExposedActions(): AuriaListenerActionMetadata;
    testTranslations: ListenerAction;
    getTranslations: ListenerAction;
}
