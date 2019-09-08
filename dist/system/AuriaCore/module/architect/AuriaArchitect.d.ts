import { Module, TranslationsByLang } from "../../../../kernel/module/Module";
import { System } from "../../../../kernel/System";
export declare class AuriaArchitect extends Module {
    constructor(system: System);
    loadTranslations(): TranslationsByLang;
}
