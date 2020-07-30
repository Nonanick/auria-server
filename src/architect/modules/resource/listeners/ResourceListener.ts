import { ModuleListener } from "../../../../kernel/module/api/ModuleListener.js";
import { OnlyAdminsCanAccessArchitect } from "../../../accessRules/OnlyAdminsCanAccessArchitect.js";
import { ResourceModule } from "../ResourceModule.js";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { ArchitectListenerAction } from "../../../request/ArchitectListenerAction.js";



export class ResourceListener extends ModuleListener {

    constructor(module: ResourceModule) {
        super(module, "Resource");
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
        return {
            "get": {
                DISABLE_WHITELIST_RULE : true,
                DISABLE_BLACKLIST_RULE : true,
                accessRules: [
                    OnlyAdminsCanAccessArchitect
                ]
            }
        }
    }

    public get: ArchitectListenerAction = (req) => {
        let resourceName = req.getRequiredParam("resource");
        console.log(req.resourceManager.getResourceByName(resourceName));
    };

}