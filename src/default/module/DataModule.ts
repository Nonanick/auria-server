import { System } from "../../kernel/System.js";import { ProviderListener } from "./data/ProviderListener.js";import { WriterListener } from "./data/WriterListener.js";import { TranslationsByLang, Module } from "../../kernel/module/Module.js";





export class DataModule extends Module {


    constructor(system : System) {
        super(system, "Data");

        this.addModuleListener(
            new ProviderListener(this),
            new WriterListener(this)
        );
    }

    protected loadTranslations(): TranslationsByLang {
        throw new Error("Method not implemented.");
    }

}