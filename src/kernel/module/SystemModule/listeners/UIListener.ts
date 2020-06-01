import { Module } from "../../Module.js";import { ListenerActionsMetadata } from "../../api/ListenerAction.js";
import { ModuleListener } from "../../api/ModuleListener.js";
import { ListenerRequest } from "../../../http/request/ListenerRequest.js";
import { AuriaResponse } from "../../../http/AuriaResponse.js";

export class UIListener extends ModuleListener {
    
    constructor(module: Module) {
        super(module, "UIListener");
    }

    public getMetadataFromExposedActions(): ListenerActionsMetadata {
        return { 
            "menuTree" : {},
            "getModulesTree" : {}
        };
    }

    public menuTree: (req: ListenerRequest, res: AuriaResponse) => void =
        (req, res) => {
            res.send();
            //let access = this.module.getSystem().getSystemAccessManager();

            //let acessTree = access.getUserAccessTree();
        }

    public getModulesTree: (req: ListenerRequest, res: AuriaResponse) => void =
        (req, res) => {

            res.addToResponse({
                moduleTree: [
                    {
                        module: 'ModuleName',
                        title : "@{Module.ModuleName.Title}",
                        entries: [
                            {
                                name: 'Entry1',
                                text: '@{ModuleName.Entry1.Title}',
                                icon: '',
                                child: [{
                                    name: 'Entry1-SubEntry1',
                                    text: '@{ModuleName.Entry1.SubEntry1.Title}',
                                    icon: '',
                                    child: []
                                },
                                {
                                    name: 'Entry1-SubEntry2',
                                    text: '@{ModuleName.Entry1.SubEntry2.Title}',
                                    icon: '',
                                    child: []
                                }]
                            }
                        ]
                    }
                ]
            });

            res.send();
        };

}