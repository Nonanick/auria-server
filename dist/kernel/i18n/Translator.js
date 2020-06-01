import { DEFAULT_LANG, DEFAULT_LANG_VARIATION } from "../System.js";
export class Translator {
    constructor(system) {
        this.system = system;
        this.loadedTranslations = new Map();
        this.buildTranslations(DEFAULT_LANG, DEFAULT_LANG_VARIATION);
    }
    static objectToTranslations(obj) {
        let translations = {};
        Object.assign(translations, Translator.convertToTranslations(obj));
        return translations;
    }
    static convertToTranslations(obj, builtKey = "") {
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
    /**
     * Fetch the language from the server and load it into the 'loadedTranslations' map
     *
     * @param lang Language to be loaded
     * @param variation Variation to be loaded
     */
    buildTranslations(lang = DEFAULT_LANG, variation = "") {
        this.system.getSystemConnection()
            .select("name", "value")
            .from("text_resource")
            .where("lang", lang)
            .andWhere("variation", "like", "%" + variation + "%")
            .then((res) => {
            let trans = {};
            res.forEach((val) => {
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
    addLanguage(lang, variation = "") {
        this.buildTranslations(lang, variation);
    }
    /**
     * Translate Text to the given language
     *
     * @param langVariation Language + Variation concatenated
     * @param text Text to be translated
     */
    translateText(langVariation, text) {
        let matchedVals = text.match(/@{.*}/g);
        if (matchedVals != null) {
            let translatedText = text;
            let translations = this.loadedTranslations.get(langVariation);
            if (translations != undefined) {
                matchedVals.forEach((val) => {
                    let pureKey = val.slice(2, -1);
                    translatedText.replace(val, translations[pureKey]);
                });
                return translatedText;
            }
            else {
                return text;
            }
        }
        else {
            return text;
        }
    }
    getTranslations(langVar) {
        return this.loadedTranslations.get(langVar);
    }
    addTranslations(lang, translations) {
        let trans = this.loadedTranslations.get(lang) || {};
        console.log("Adding translations for language:", lang, translations);
        trans = Object.assign(trans, translations);
        this.loadedTranslations.set(lang, trans);
    }
}
export var Languages;
(function (Languages) {
    Languages["English"] = "en";
    Languages["Portuguese"] = "pt";
    Languages["Spanish"] = "es";
})(Languages || (Languages = {}));
;
