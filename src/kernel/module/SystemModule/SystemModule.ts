import { Module, TranslationsByLang } from "../Module";
import { System } from "../../System";
import { UIListener } from "./listeners/UIListener";
import { I18nListener } from "./listeners/I18nListener";
import { TableListener } from "./listeners/TableListener";
import { LoginListener } from "./listeners/LoginListener";
import { DataSyncListener } from "./listeners/DataSyncListener";
import { SystemEnglish } from "./i18n/Lang-En";
import { Languages, Translator } from "../../i18n/Translator";
import { SystemPortuguese } from "./i18n/Lang-Pt";



export class SystemModule extends Module {

    private __translations: TranslationsByLang = {};

    constructor(system: System) {
        super(system, "SystemModule");

        this.addListener(
            // Add translations capability
            new I18nListener(this),
            // Add UI interface parameters
            new UIListener(this),
            // Add Table metadata exposure
            new TableListener(this),
            // Add Login functionality to the server!
            new LoginListener(this),
            // Add Data Sync functionality
            new DataSyncListener(this),
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


}