import { Module } from "../Module.js";
import { Languages } from "../../i18n/Translator.js";
export class DatabaseModule extends Module {
    constructor(system, name) {
        super(system, name);
        this.name = name;
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
//# sourceMappingURL=DatabaseModule.js.map