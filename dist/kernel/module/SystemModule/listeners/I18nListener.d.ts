import { ModuleListener, ListenerActionsDefinition } from "../../ModuleListener";
import { AuriaRequest } from "../../../http/AuriaRequest";
import { AuriaResponse } from "../../../http/AuriaResponse";
import { Module } from "../../Module";
export declare class I18nListener extends ModuleListener {
    constructor(module: Module);
    getExposedActionsDefinition(): ListenerActionsDefinition;
    getRequiredRequestHandlers(): import("../../../http/AuriaMiddleware").AuriaMiddleware[];
    getTranslations: (req: AuriaRequest, res: AuriaResponse) => void;
}
