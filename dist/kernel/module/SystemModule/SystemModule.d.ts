import { Module, TranslationsByLang } from "../Module";
import { System } from "../../System";
import { ModuleRequest } from "../../http/request/ModuleRequest";
import { Response } from "express-serve-static-core";
export declare class SystemModule extends Module {
    private __translations;
    private loginListener;
    constructor(system: System);
    loadTranslations(): TranslationsByLang;
    getTranslations(): TranslationsByLang;
    handleRequest(request: ModuleRequest, response: Response): Promise<any>;
}
