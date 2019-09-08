import { Module, TranslationsByLang } from "../Module";
import { System } from "../../System";
import { ModuleRowData } from "../ModuleRowData";
export declare class DatabaseModule extends Module {
    /**
     * Populate a Module with information coming from the database
     *
     * @param mod Module to be populated
     * @param info Information that came from the query
     */
    static setRowInfoToModule(mod: Module, info: ModuleRowData): Module;
    /**
     * When this database is initialized via DB Query the base row data
     * is stored in this variable in case this Module is merged with an
     * existing coded counterpart
     *
     */
    protected rowInfo: ModuleRowData;
    constructor(system: System, name: string);
    protected fetchGlobalListeners(): void;
    setRowInfo(info: ModuleRowData): DatabaseModule;
    /**
     * Return table row data that was used to create this database module
     * might be null if this database was not initialized via a table row
     *
     */
    getRowInfo(): ModuleRowData;
    mergeWithCodedModule(module: Module): void;
    protected loadTranslations(): TranslationsByLang;
}
