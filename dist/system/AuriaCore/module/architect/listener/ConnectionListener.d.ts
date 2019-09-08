import { ModuleListener, ListenerActionsDefinition } from "../../../../../kernel/module/ModuleListener";
import { AuriaMiddleware } from "../../../../../kernel/http/AuriaMiddleware";
export declare class ConnectionListener extends ModuleListener {
    getRequiredRequestHandlers(): AuriaMiddleware[];
    getExposedActionsDefinition(): ListenerActionsDefinition;
}
