import { Module, TranslationsByLang } from "../../../kernel/module/Module.js";
import { ArchitectSystem } from "../../ArchitecSystem.js";
import { Translator } from "../../../kernel/i18n/Translator.js";
import { ArchitectModuleRequest } from "../../request/ArchitectModuleRequest.js";
import { ResourceListener } from "./listeners/ResourceListener.js";
import { DatabaseListener } from "./listeners/database/DatabaseListener.js";

export class ResourceModule extends Module {

    constructor(system: ArchitectSystem) {
        super(system, "Resource");

        this.color = "";
        this.icon = "data";
        this.title = "@{Auria.Architect.Modules.Resource.Title}";
        this.description = "@{Auria.Architect.Modules.Resource.Description}";
        this.behaviour = "Hybrid";

        this.requestFactory = () => {
            return (request, user, module) => {
                let architectModuleRequest: ArchitectModuleRequest = {
                    ...request,
                    ...{
                        getUser: () => user,
                        resourceManager: system.getResourceManager(),
                        connection : system.getSystemConnection()
                    }
                };

                return architectModuleRequest;
            };
        };

        this.addModuleListener(
            new ResourceListener(this),
            new DatabaseListener(this,)
        )
    }

    protected loadTranslations(): TranslationsByLang {
        return {
            "en": Translator.objectToTranslations({
                Auria: {
                    Architect: {
                        Modules: {
                            Resource: {
                                Title: "Resource Module",
                                Description: "Manage all Auria resources easily, creating and maintaning data structures with the ease of spreadsheets",

                            }
                        }
                    }
                }
            })
        };
    }

}