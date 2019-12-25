import { Module, TranslationsByLang } from "../Module";
import { System } from "../../System";
import { ModuleRowData } from "../ModuleRowData";
import { ModuleListenerRowData } from "./ModuleListenerRowData";
import { ModuleManager } from "../ModuleManager";
import { Languages } from "../../i18n/Translator";

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

    constructor(system: System, name: string) {
        super(system, name);
        this.name = name;

        this.fetchGlobalListeners();
    }

    protected fetchGlobalListeners() {

        let conn = this.system.getSystemConnection();

        conn
            .select("name", "title", "description")
            .from("module_listener")
            .where("module_name", this.name)
            .andWhere("active", 1)
            .then((res) => {
                (res as ModuleListenerRowData[]).forEach((listInfo) => {
                    let list = ModuleManager.getGlobalListener(this, listInfo.name);
                    console.log("[Database Module] Loading Global Listener: ", list.constructor.name);
                    this.addListener(list);
                });
            })
            .catch((err) => {
                console.error("[Database Module] SQL Query Error:\n \
            Failed to fetch global module listeners to module ", this.name);
            });

    }


    public setRowInfo(info: ModuleRowData): DatabaseModule {

        this.rowInfo = info;
        DatabaseModule.setRowInfoToModule(this, info);
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
        this.listeners.forEach((list) => {
            module.addListener(list);
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