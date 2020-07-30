import { Module, TranslationsByLang } from "../Module.js";
import { ModuleInterface, ModuleInterfaceDescription } from "../interface/ModuleInterface.js";
import { System } from "../../System.js";
import { ModuleRowData } from "../../resource/rowModel/ModuleRowData.js";
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
    protected id: number;
    protected interface: ModuleInterface;
    protected loadInterfacePromise: Promise<ModuleInterfaceDescription>;
    constructor(system: System, name: string);
    initializeWithDbInfo(info: ModuleRowData): DatabaseModule;
    /**
     * Return table row data that was used to create this database module
     * might be null if this database was not initialized via a table row
     *
     */
    getRowInfo(): ModuleRowData;
    mergeWithCodedModule(module: Module): void;
    protected loadTranslations(): TranslationsByLang;
}
