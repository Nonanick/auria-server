import { ModuleListener } from "../../kernel/module/ModuleListener";
import { ListenerActionsMetadata } from "../../kernel/module/ListenerAction";

export class AuriaModuleListener extends ModuleListener {

    public getExposedActionsMetadata(): ListenerActionsMetadata {
        throw new Error("Method not implemented.");
    }    
    
}