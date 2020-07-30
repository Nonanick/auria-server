import { Module, TranslationsByLang } from "../Module.js";
import { ModuleInterface, ModuleInterfaceDescription } from "../interface/ModuleInterface.js";
import { System } from "../../System.js";
import { Languages } from "../../i18n/Translator.js";
import { ModuleRowData } from "../../resource/rowModel/ModuleRowData.js";

export class DatabaseModule extends Module {

    /**
     * Populate a Module with information coming from the database
     * 
     * @param mod Module to be populated
     * @param info Information that came from the query
     */
    public static setRowInfoToModule(mod: Module, info: ModuleRowData) {

        mod.title = info.title;
        mod.description = info.description;
        mod.color = info.color;
        mod.icon = info.icon;

        return mod;
    }

    /**
     * When this database is initialized via DB Query the base row data
     * is stored in this variable in case this Module is merged with an
     * existing coded counterpart
     * 
     */
    protected rowInfo: ModuleRowData;

    protected id: number;

    protected interface: ModuleInterface;

    protected loadInterfacePromise: Promise<ModuleInterfaceDescription>;

    constructor(system: System, name: string) {
        super(system, name);
        this.name = name;

    }

    public initializeWithDbInfo(info: ModuleRowData): DatabaseModule {

        this.rowInfo = info;
        DatabaseModule.setRowInfoToModule(this, info);
        this.id = info._id;
        return this;
    }

    /**
     * Return table row data that was used to create this database module
     * might be null if this database was not initialized via a table row
     * 
     */
    public getRowInfo(): ModuleRowData {
        return this.rowInfo;
    }

    public mergeWithCodedModule(module: Module) {
        // # - Apply listeners
        this.moduleListeners.forEach((list) => {
            module.addModuleListener(list);
        });

        // # - Apply Properties
        if (this.rowInfo != null) {
            DatabaseModule.setRowInfoToModule(module, this.getRowInfo());
        }
    }


    protected loadTranslations(): TranslationsByLang {
        let translations: TranslationsByLang = {};
        translations[Languages.English] = {};
        return translations;
    }
}