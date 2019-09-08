import { ModuleListener,  ListenerActionsDefinition } from "../../ModuleListener";
import { AuriaRequest } from "../../../http/AuriaRequest";
import { AuriaResponse } from "../../../http/AuriaResponse";
import { Module } from "../../Module";

export class UIListener extends ModuleListener {
    
    public getRequiredRequestHandlers(): import("../../../http/AuriaMiddleware").AuriaMiddleware[] {
        throw new Error("Method not implemented.");
    }

    constructor(module: Module) {
        super(module, "UIListener");
    }

    public getExposedActionsDefinition(): ListenerActionsDefinition {
        return { 
            "menuTree" : {
                tables : {}
            },
            "getModulesTree" : {
                tables : {}
            }
        };
    }

    public menuTree: (req: AuriaRequest, res: AuriaResponse) => void =
        (req, res) => {
            res.send();
            //let access = this.module.getSystem().getSystemAccessManager();

            //let acessTree = access.getUserAccessTree();
        }

    public getModulesTree: (req: AuriaRequest, res: AuriaResponse) => void =
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