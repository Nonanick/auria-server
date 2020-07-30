import { Module, TranslationsByLang } from "../Module.js";
import { System } from "../../System.js";
import { ModuleRequest } from "../../http/request/ModuleRequest.js";
export declare class SystemModule extends Module {
    private __translations;
    private loginListener;
    constructor(system: System);
    loadTranslations(): TranslationsByLang;
    getTranslations(): TranslationsByLang;
    handleRequest(request: ModuleRequest): Promise<any>;
}
