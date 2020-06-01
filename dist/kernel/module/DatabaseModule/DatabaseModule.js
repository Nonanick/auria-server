var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Module } from "../Module.js";
import { ModuleMenu } from "../interface/ModuleMenu.js";
import { ModulePage } from "../interface/ModulePage.js";
import { ModuleMenuResourceDefinition as ModuleMenuD } from "../../resource/systemSchema/moduleMenu/ModuleMenuResourceDefinition.js";
import { ModulePageResourceDefinition as ModulePageD } from "../../resource/systemSchema/modulePage/ModulePageResourceDefinition.js";
import { Languages } from "../../i18n/Translator.js";
export class DatabaseModule extends Module {
    constructor(system, name) {
        super(system, name);
        this.name = name;
        this.fetchGlobalListeners();
        this.loadInterface();
    }
    /**
     * Populate a Module with information coming from the database
     *
     * @param mod Module to be populated
     * @param info Information that came from the query
     */
    static setRowInfoToModule(mod, info) {
        mod.title = info.title;
        mod.description = info.description;
        mod.color = info.color;
        mod.icon = info.icon;
        return mod;
    }
    loadInterface() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loadInterfacePromise == null) {
                this.loadInterfacePromise =
                    Promise.resolve()
                        .then(_ => this.loadInterfaceRootMenus())
                        .then(_ => this.loadInterfaceRootPages())
                        .then(_ => this.interface.getInterfaceDescription());
            }
            return this.loadInterfacePromise;
        });
    }
    loadInterfaceRootMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.system.getSystemConnection()
                .select("*")
                .from(ModuleMenuD.tableName)
                .where("module_id", this.id)
                .where("parent_menu_id", null)
                .then((menus) => __awaiter(this, void 0, void 0, function* () {
                for (var a = 0; a < menus.length; a++) {
                    let menuInfo = menus[a];
                    let menu = ModuleMenu.fromDescription(this, menuInfo);
                    yield menu.loadItensFromId(menuInfo[ModuleMenuD.columns.ID.columnName]);
                    this.interface.addItem(menu);
                }
            }));
        });
    }
    loadInterfaceRootPages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.system.getSystemConnection()
                .select("*")
                .from(ModulePageD.tableName)
                .where("module_id", this.id)
                .where("parent_menu", null)
                .then((pages) => __awaiter(this, void 0, void 0, function* () {
                for (var a = 0; a < pages.length; a++) {
                    let pageInfo = pages[a];
                    let page = ModulePage.fromDescription(this, pageInfo);
                    this.interface.addItem(page);
                }
            }));
        });
    }
    fetchGlobalListeners() {
    }
    initializeWithDbInfo(info) {
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
    getRowInfo() {
        return this.rowInfo;
    }
    mergeWithCodedModule(module) {
        // # - Apply listeners
        this.moduleListeners.forEach((list) => {
            module.addModuleListener(list);
        });
        // # - Apply Properties
        if (this.rowInfo != null) {
            DatabaseModule.setRowInfoToModule(module, this.getRowInfo());
        }
    }
    loadTranslations() {
        let translations = {};
        translations[Languages.English] = {};
        return translations;
    }
}
