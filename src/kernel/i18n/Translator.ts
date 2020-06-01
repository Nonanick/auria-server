import { System, DEFAULT_LANG, DEFAULT_LANG_VARIATION } from "../System.js";

export class Translator {

    public static objectToTranslations(obj: any): { [key: string]: string } {
        let translations: { [key: string]: string } = {};

        Object.assign(translations, Translator.convertToTranslations(obj));

        return translations;
    }

    private static convertToTranslations(obj: any, builtKey: string = "") {

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                let value = obj[prop];
                let keyValue = builtKey == "" ? prop : builtKey + "." + prop;
                if (typeof value == "object") {
                    delete obj[prop];
                    obj = Object.assign(obj, this.convertToTranslations(value, keyValue));
                }
                if (typeof value == "string") {
                    delete obj[prop];
                    obj[keyValue] = value;
                }
            }
        }

        return obj;
    }

    protected system: System;

    protected loadedTranslations: Map<string, { [transKey: string]: string }>;

    constructor(system: System) {

        this.system = system;
        this.loadedTranslations = new Map();
        this.buildTranslations(DEFAULT_LANG, DEFAULT_LANG_VARIATION);

    }

    /**
     * Fetch the language from the server and load it into the 'loadedTranslations' map
     * 
     * @param lang Language to be loaded
     * @param variation Variation to be loaded
     */
    protected buildTranslations(lang: string = DEFAULT_LANG, variation: string = "") {

        this.system.getSystemConnection()
            .select("name", "value")
            .from("text_resource")
            .where("lang", lang)
            .andWhere("variation", "like", "%" + variation + "%")
            .then((res) => {
                let trans: {
                    [transKey: string]: string
                } = {};

                (res as any[]).forEach((val) => {
                    trans[val.name] = val.value;
                });
                console.log("[Translator] Loaded lang + Variation :", lang);
                this.addTranslations(lang, trans);
            }).catch((err) => {
                console.error("[Translator] Failed to load translations from DB, query error!\nSQL:" + err.message);
            });

    }

    /**
     * Add a Language to be loaded into the system
     * 
     * @param lang Language as string (usually 2 chars)
     * @param variation Variation as string (usually 2 chars)
     */
    public addLanguage(lang: string, variation: string = "") {
        this.buildTranslations(lang, variation);
    }

    /**
     * Translate Text to the given language
     * 
     * @param langVariation Language + Variation concatenated
     * @param text Text to be translated
     */
    public translateText(langVariation: string, text: string) {

        let matchedVals = text.match(/@{.*}/g);

        if (matchedVals != null) {

            let translatedText: string = text;

            let translations: { [transKey: string]: string } =
                (this.loadedTranslations.get(langVariation) as any);

            if (translations != undefined) {

                matchedVals.forEach((val) => {
                    let pureKey = val.slice(2, -1);
                    translatedText.replace(val, translations[pureKey]);
                });

                return translatedText;
            } else {
                return text;
            }
        } else {
            return text;
        }
    }

    public getTranslations(langVar: string) {
        return this.loadedTranslations.get(langVar);
    }

    public addTranslations(lang: string, translations: { [key: string]: string }) {

        let trans = this.loadedTranslations.get(lang) || {};
        console.log("Adding translations for language:", lang, translations);
        trans = Object.assign(trans, translations);
        this.loadedTranslations.set(lang, trans);
    }

}


export enum Languages {
    English = "en",
    Portuguese = "pt",
    Spanish = "es"
};