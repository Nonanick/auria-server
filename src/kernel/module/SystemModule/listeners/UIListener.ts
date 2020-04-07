import { ModuleListener } from "../../ModuleListener";
import { AuriaResponse } from "../../../http/AuriaResponse";
import { Module } from "../../Module";
import { ListenerRequest } from "../../../http/request/ListenerRequest";
import { ListenerActionsMetadata } from "../../ListenerAction";

export class UIListener extends ModuleListener {
    
    constructor(module: Module) {
        super(module, "UIListener");
    }

    public getExposedActionsMetadata(): ListenerActionsMetadata {
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