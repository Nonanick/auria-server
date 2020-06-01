import { AuriaListenerActionMetadata } from "../listener/AuriaListenerActionMetadata.js";
import { ModuleListener } from "../../../kernel/module/api/ModuleListener.js";
import { Module } from "../../../kernel/module/Module.js";
import { ListenerAction } from "../../../kernel/module/api/ListenerAction.js";



export class WriterListener extends ModuleListener {

    constructor(module: Module) {
        super(module, "Writer");
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
        return {
            "create" : {
                DISABLE_WHITELIST_RULE : true,
            },
            "update" : {
                DISABLE_WHITELIST_RULE : true,
            },
            "delete" : {
                DISABLE_WHITELIST_RULE : true
            }
        }
    }

    public create : ListenerAction  = (req) => {

    };

    public update : ListenerAction = (req) => {

    };

    public delete : ListenerAction = (req) => {

    }

}