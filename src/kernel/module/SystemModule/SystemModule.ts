
import { Response } from "express-serve-static-core";
import { Module, TranslationsByLang } from "../Module.js";
import { LoginListener } from "./listeners/LoginListener.js";
import { I18nListener } from "./listeners/I18nListener.js";
import { TableListener } from "./listeners/TableListener.js";
import { UserListener } from "./listeners/UserListener.js";
import { SystemEnglish } from "./i18n/Lang-En.js";
import { SystemPortuguese } from "./i18n/Lang-Pt.js";
import { LoginRequestFactory } from "./requests/LoginRequest.js";
import { System } from "../../System.js";
import { Languages, Translator } from "../../i18n/Translator.js";
import { ModuleRequest } from "../../http/request/ModuleRequest.js";



export class SystemModule extends Module {

    private __translations: TranslationsByLang = {};

    private loginListener: LoginListener;

    constructor(system: System) {
        super(system, "System");

        this.loginListener = new LoginListener(this);

        this.addModuleListener(
            // Add translations capability
            new I18nListener(this),

            // Add UI interface parameters
            // new UIListener(this),

            // Add Table metadata exposure
            new TableListener(this),

            // Add Login functionality to the server!
            this.loginListener,

            // Add User Related functions
            new UserListener(this),
        );

    }

    public loadTranslations(): TranslationsByLang {

        this.__translations[Languages.English] = Translator.objectToTranslations(SystemEnglish);
        this.__translations[Languages.Portuguese] = Translator.objectToTranslations(SystemPortuguese);

        return this.__translations;

    }

    public getTranslations() {
        let translations: TranslationsByLang = this.loadTranslations();

        for (var lang in translations) {
            if (translations.hasOwnProperty(lang)) {
                let t = translations[lang];
                for (var key in t) {
                    let value = t[key];
                    delete t[key];
                    t["Auria.System." + key] = value;
                }
            }
        }
        return translations;
    }

    public handleRequest(request: ModuleRequest, response: Response) {

        // Adds 'setCookie' and 'loginWithPassword' capabilities
        if (request.getRequestStack().listener() == this.loginListener.name
            || request.getRequestStack().listener() + "Listener" == this.loginListener.name) {
            request = LoginRequestFactory.make(request, response, this.system);
        }
        return super.handleRequest(request, response);
    }


}