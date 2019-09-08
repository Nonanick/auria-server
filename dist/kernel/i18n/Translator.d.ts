import { System } from "../System";
export declare class Translator {
    static objectToTranslations(obj: any): {
        [key: string]: string;
    };
    private static convertToTranslations;
    protected system: System;
    protected loadedTranslations: Map<string, {
        [transKey: string]: string;
    }>;
    constructor(system: System);
    /**
     * Fetch the language from the server and load it into the 'loadedTranslations' map
     *
     * @param lang Language to be loaded
     * @param variation Variation to be loaded
     */
    protected buildTranslations(lang?: string, variation?: string): void;
    /**
     * Add a Language to be loaded into the system
     *
     * @param lang Language as string (usually 2 chars)
     * @param variation Variation as string (usually 2 chars)
     */
    addLanguage(lang: string, variation?: string): void;
    /**
     * Translate Text to the given language
     *
     * @param langVariation Language + Variation concatenated
     * @param text Text to be translated
     */
    translateText(langVariation: string, text: string): string;
    getTranslations(langVar: string): {
        [transKey: string]: string;
    } | undefined;
    addTranslations(lang: string, translations: {
        [key: string]: string;
    }): void;
}
export declare enum Languages {
    English = "en",
    Portuguese = "pt",
    Spanish = "es"
}
