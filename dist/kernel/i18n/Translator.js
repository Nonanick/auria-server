"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const System_1 = require("../System");
class Translator {
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
    constructor(system) {
        this.system = system;
        this.loadedTranslations = new Map();
        this.buildTranslations(System_1.DEFAULT_LANG, System_1.DEFAULT_LANG_VARIATION);
    }
    /**
     * Fetch the language from the server and load it into the 'loadedTranslations' map
     *
     * @param lang Language to be loaded
     * @param variation Variation to be loaded
     */
    buildTranslations(lang = System_1.DEFAULT_LANG, variation = "") {
        this.system.getSystemConnection()
            .query("SELECT name, value \
          FROM text_resource \
          WHERE `lang`=? AND `variation` LIKE ?", [lang, '%' + variation + '%']).then((res) => {
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
exports.Translator = Translator;
var Languages;
(function (Languages) {
    Languages["English"] = "en";
    Languages["Portuguese"] = "pt";
    Languages["Spanish"] = "es";
})(Languages = exports.Languages || (exports.Languages = {}));
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvaTE4bi9UcmFuc2xhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBRXpFLE1BQWEsVUFBVTtJQUVaLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFRO1FBQ3ZDLElBQUksWUFBWSxHQUE4QixFQUFFLENBQUM7UUFFakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFbkUsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFRLEVBQUUsV0FBbUIsRUFBRTtRQUVoRSxLQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtZQUNsQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxRQUFRLEdBQUcsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztnQkFDN0QsSUFBSSxPQUFPLEtBQUssSUFBSSxRQUFRLEVBQUU7b0JBQzFCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqQixHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2lCQUN6RTtnQkFDRCxJQUFJLE9BQU8sS0FBSyxJQUFJLFFBQVEsRUFBRTtvQkFDMUIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3pCO2FBQ0o7U0FDSjtRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQU1ELFlBQVksTUFBYztRQUV0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsaUJBQWlCLENBQUMscUJBQVksRUFBRSwrQkFBc0IsQ0FBQyxDQUFDO0lBRWpFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGlCQUFpQixDQUFDLE9BQWUscUJBQVksRUFBRSxZQUFvQixFQUFFO1FBRTNFLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUU7YUFDNUIsS0FBSyxDQUNGOztnREFFZ0MsRUFDaEMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FDaEMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNYLElBQUksS0FBSyxHQUVMLEVBQUUsQ0FBQztZQUVOLEdBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDM0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0VBQXNFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hHLENBQUMsQ0FBQyxDQUFDO0lBRVgsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLElBQVksRUFBRSxZQUFvQixFQUFFO1FBQ25ELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksYUFBYSxDQUFDLGFBQXFCLEVBQUUsSUFBWTtRQUVwRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXZDLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtZQUVyQixJQUFJLGNBQWMsR0FBVyxJQUFJLENBQUM7WUFFbEMsSUFBSSxZQUFZLEdBQ1gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQVMsQ0FBQztZQUV4RCxJQUFJLFlBQVksSUFBSSxTQUFTLEVBQUU7Z0JBRTNCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDeEIsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDO2dCQUVILE9BQU8sY0FBYyxDQUFDO2FBQ3pCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFTSxlQUFlLENBQUMsT0FBZTtRQUNsQyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLGVBQWUsQ0FBQyxJQUFZLEVBQUUsWUFBdUM7UUFFeEUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDckUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FFSjtBQS9IRCxnQ0ErSEM7QUFHRCxJQUFZLFNBSVg7QUFKRCxXQUFZLFNBQVM7SUFDakIsMkJBQWMsQ0FBQTtJQUNkLDhCQUFpQixDQUFBO0lBQ2pCLDJCQUFjLENBQUE7QUFDbEIsQ0FBQyxFQUpXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBSXBCO0FBQUEsQ0FBQyJ9