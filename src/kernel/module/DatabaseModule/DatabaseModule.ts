import { Module, TranslationsByLang } from "../Module.js";
import { ModuleRowData } from "../ModuleRowData.js";
import { ModuleInterface, ModuleInterfaceDescription } from "../interface/ModuleInterface.js";
import { System } from "../../System.js";
import { ModuleMenu } from "../interface/ModuleMenu.js";
import { ModulePage } from "../interface/ModulePage.js";
import { ModuleMenuResourceDefinition as ModuleMenuD } from "../../resource/systemSchema/moduleMenu/ModuleMenuResourceDefinition.js";
import { ModulePageResourceDefinition as ModulePageD } from "../../resource/systemSchema/modulePage/ModulePageResourceDefinition.js";
import { Languages } from "../../i18n/Translator.js";

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

        this.fetchGlobalListeners();

        this.loadInterface();
    }


    protected async loadInterface(): Promise<ModuleInterfaceDescription> {
        if (this.loadInterfacePromise == null) {

            this.loadInterfacePromise =
                Promise.resolve()
                    .then(_ => this.loadInterfaceRootMenus())
                    .then(_ => this.loadInterfaceRootPages())
                    .then(_ => this.interface.getInterfaceDescription());
        }

        return this.loadInterfacePromise;
    }

    private async loadInterfaceRootMenus() {
        return this.system.getSystemConnection()
            .select("*")
            .from(ModuleMenuD.tableName)
            .where("module_id", this.id)
            .where("parent_menu_id", null)
            .then(async (menus) => {
                for (var a = 0; a < menus.length; a++) {
                    let menuInfo = menus[a];
                    let menu = ModuleMenu.fromDescription(this, menuInfo);
                    await menu.loadItensFromId(menuInfo[ModuleMenuD.columns.ID.columnName]);
                    this.interface.addItem(menu);
                }
            });
    }

    private async loadInterfaceRootPages() {
        return this.system.getSystemConnection()
            .select("*")
            .from(ModulePageD.tableName)
            .where("module_id", this.id)
            .where("parent_menu", null)
            .then(async (pages) => {
                for (var a = 0; a < pages.length; a++) {
                    let pageInfo = pages[a];
                    let page = ModulePage.fromDescription(this, pageInfo);
                    this.interface.addItem(page);
                }
            });
    }

    protected fetchGlobalListeners() {

      

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