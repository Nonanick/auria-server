import { ModuleListener } from "../../../../../kernel/module/ModuleListener";
import { ListenerActionsMetadata } from "../../../../../kernel/module/ListenerAction";

export class ConnectionListener extends ModuleListener {
    
    public getExposedActionsMetadata(): ListenerActionsMetadata {
       return {};

    }
    
}