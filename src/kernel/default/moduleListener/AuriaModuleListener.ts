import { ModuleListener, ListenerActionsDefinition } from "../../module/ModuleListener";
import { AuriaMiddleware } from "../../http/AuriaMiddleware";

export class AuriaModuleListener extends ModuleListener {

    public getExposedActionsDefinition(): ListenerActionsDefinition {
        throw new Error("Method not implemented.");
    }    
    
    public getRequiredRequestHandlers(): AuriaMiddleware[] {
        throw new Error("Method not implemented.");
    }


}