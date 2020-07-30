import { ModuleListener } from "../../api/ModuleListener.js";
export class UIListener extends ModuleListener {
    constructor(module) {
        super(module, "UIListener");
        this.menuTree = (req, res) => {
            res.send();
            //let access = this.module.getSystem().getSystemAccessManager();
            //let acessTree = access.getUserAccessTree();
        };
        this.getModulesTree = (req, res) => {
            res.addToResponse({
                moduleTree: [
                    {
                        module: 'ModuleName',
                        title: "@{Module.ModuleName.Title}",
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
    getMetadataFromExposedActions() {
        return {
            "menuTree": {},
            "getModulesTree": {}
        };
    }
}
//# sourceMappingURL=UIListener.js.map