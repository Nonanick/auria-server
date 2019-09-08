import { Module, TranslationsByLang } from "../Module";
import { System } from "../../System";
export declare class SystemModule extends Module {
    private __translations;
    constructor(system: System);
    loadTranslations(): TranslationsByLang;
    getTranslations(): TranslationsByLang;
}
