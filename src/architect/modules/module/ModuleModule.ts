import { Module, TranslationsByLang } from "../../../kernel/module/Module.js";
import { ArchitectSystem } from "../../ArchitecSystem.js";
import { Translator } from "../../../kernel/i18n/Translator.js";

export class ModuleModule extends Module {

    constructor(system: ArchitectSystem) {
        super(system, "Module");
        this.title = "@{Auria.Architect.Modukes.Module.Title}";
        this.description = "@{Auria.Architect.Modukes.Module.Description}";
        this.icon = "module";
        this.color = "";
        this.behaviour = "Hybrid";
        
    }

    protected loadTranslations(): TranslationsByLang {
        return {
            "en": Translator.objectToTranslations({
                Auria: {
                    Architect: {
                        Modules: {
                            Module: {
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