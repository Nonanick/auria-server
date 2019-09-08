import { ModuleListener, ListenerActionsDefinition } from "../../../../../kernel/module/ModuleListener";
import { AuriaMiddleware } from "../../../../../kernel/http/AuriaMiddleware";

export class ConnectionListener extends ModuleListener {
    public getRequiredRequestHandlers(): AuriaMiddleware[] {
        return [];
    }
    
    public getExposedActionsDefinition(): ListenerActionsDefinition {
        throw new Error("Method not implemented.");
    }
    
}