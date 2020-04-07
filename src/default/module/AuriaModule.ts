import { Module, TranslationsByLang } from "../../kernel/module/Module";

export class AuriaModule extends Module {

    protected loadTranslations(): TranslationsByLang {
        console.log("Testing dirname in extended classes", __dirname);
        return {};
    }

}