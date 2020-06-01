import { ListenerActionsMetadata } from "../../kernel/module/api/ListenerAction";
import { ModuleListener } from "../../kernel/module/api/ModuleListener.js";



export class AuriaModuleListener extends ModuleListener {

    public getMetadataFromExposedActions(): ListenerActionsMetadata {
        throw new Error("Method not implemented.");
    }    
    
}