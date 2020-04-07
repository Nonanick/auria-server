"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
class UIListener extends ModuleListener_1.ModuleListener {
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
    getExposedActionsMetadata() {
        return {
            "menuTree": {},
            "getModulesTree": {}
        };
    }
}
exports.UIListener = UIListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUlMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvVUlMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUFzRDtBQU10RCxNQUFhLFVBQVcsU0FBUSwrQkFBYztJQUUxQyxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQVV6QixhQUFRLEdBQ1gsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDVCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWCxnRUFBZ0U7WUFFaEUsNkNBQTZDO1FBQ2pELENBQUMsQ0FBQTtRQUVFLG1CQUFjLEdBQ2pCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBRVQsR0FBRyxDQUFDLGFBQWEsQ0FBQztnQkFDZCxVQUFVLEVBQUU7b0JBQ1I7d0JBQ0ksTUFBTSxFQUFFLFlBQVk7d0JBQ3BCLEtBQUssRUFBRyw0QkFBNEI7d0JBQ3BDLE9BQU8sRUFBRTs0QkFDTDtnQ0FDSSxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxJQUFJLEVBQUUsNEJBQTRCO2dDQUNsQyxJQUFJLEVBQUUsRUFBRTtnQ0FDUixLQUFLLEVBQUUsQ0FBQzt3Q0FDSixJQUFJLEVBQUUsa0JBQWtCO3dDQUN4QixJQUFJLEVBQUUsc0NBQXNDO3dDQUM1QyxJQUFJLEVBQUUsRUFBRTt3Q0FDUixLQUFLLEVBQUUsRUFBRTtxQ0FDWjtvQ0FDRDt3Q0FDSSxJQUFJLEVBQUUsa0JBQWtCO3dDQUN4QixJQUFJLEVBQUUsc0NBQXNDO3dDQUM1QyxJQUFJLEVBQUUsRUFBRTt3Q0FDUixLQUFLLEVBQUUsRUFBRTtxQ0FDWixDQUFDOzZCQUNMO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDO0lBakROLENBQUM7SUFFTSx5QkFBeUI7UUFDNUIsT0FBTztZQUNILFVBQVUsRUFBRyxFQUFFO1lBQ2YsZ0JBQWdCLEVBQUcsRUFBRTtTQUN4QixDQUFDO0lBQ04sQ0FBQztDQTRDSjtBQXZERCxnQ0F1REMifQ==