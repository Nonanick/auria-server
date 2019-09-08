import { Module, TranslationsByLang } from "../../../../kernel/module/Module";
import { System } from "../../../../kernel/System";
import { ConnectionListener } from "./listener/ConnectionListener";
import { TableManagerListener } from "./listener/TableManagerListener";
import { ArchitectEnglish } from "./i18n/Lang-En";
import { Translator, Languages } from "../../../../kernel/i18n/Translator";

export class AuriaArchitect extends Module {

    constructor(system : System) {

        super(system, "auria.architect");

        this.addListener(
            new ConnectionListener(this, "ConnectionListener"),
            new TableManagerListener(this),
        );

    }

    public loadTranslations() {
        let translations : TranslationsByLang = {};
        
        translations[Languages.English] = Translator.objectToTranslations(ArchitectEnglish);

        return translations;
    }

    
}