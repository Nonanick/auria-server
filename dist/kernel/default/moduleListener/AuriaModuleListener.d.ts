import { ModuleListener, ListenerActionsDefinition } from "../../module/ModuleListener";
import { AuriaMiddleware } from "../../http/AuriaMiddleware";
export declare class AuriaModuleListener extends ModuleListener {
    getExposedActionsDefinition(): ListenerActionsDefinition;
    getRequiredRequestHandlers(): AuriaMiddleware[];
}
