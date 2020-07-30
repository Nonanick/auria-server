import { ModuleInterface } from './interface/ModuleInterface.js';
import { ModulePageDataRequirements, ModulePageActionRequirements } from './interface/requirements/ModulePageRequirements.js';
import { ModulePage } from './interface/ModulePage.js';
import { ModuleListener } from './api/ModuleListener.js';
import { System } from '../System.js';
import { ModuleRequest, ModuleRequestFactoryFunction } from '../http/request/ModuleRequest.js';
import { ModuleBehaviour } from '../resource/systemSchema/module/ModuleResourceDefitinion.js';
import { Module as LibModule, Bootable, BootSequence } from 'aurialib2';
import { ModuleRowData } from "../resource/rowModel/ModuleRowData.js";
export declare abstract class Module extends LibModule implements Bootable {
    protected _id: number;
    protected _name: string;
    protected _title: string;
    protected _description: string;
    protected _color: string;
    protected _icon: string;
    protected rowData: ModuleRowData;
    protected rowDataPromise: Promise<ModuleRowData>;
    protected _behaviour: ModuleBehaviour;
    /**
     * Name
     * -----
     *
     * Unique identifier of this module
     */
    get name(): string;
    set name(name: string);
    /**
     * Title
     * ------
     *
     * Text repreenting the readable name of the title, might be used
     * as an i18n text
     *
     * @example 'Auria @{Module.Name.Title}'
     */
    get title(): string;
    set title(title: string);
    /**
     * Description
     * -----------
     *
     * A little text that explains the general purpose of this module,
     * might be used as an i18n text
     *
     * @example 'Auria @{Module.Name.Description}
     */
    get description(): string;
    set description(description: string);
    /**
     * Color
     * ------
     *
     * Accent color of the module, used as a visual representative
     * The color should be an string representing the RGB color as an HEX string
     *
     * @example '#098A41'
     */
    get color(): string;
    set color(color: string);
    /**
     * Icon
     * -----
     *
     * Path to an icon in the front server
     */
    get icon(): string;
    set icon(icon: string);
    get behaviour(): ModuleBehaviour;
    set behaviour(behaviour: ModuleBehaviour);
    protected interface: ModuleInterface;
    /**
     * System
     * -------
     *
     * System that hold this module
     */
    protected system: System;
    /**
     * Module Listener
     * --------
     *
     * All the listeners assigned to this module
     */
    protected moduleListeners: Map<string, ModuleListener>;
    protected moduleBoot: BootSequence;
    constructor(system: System, name: string);
    getBootFunction(): (() => Promise<boolean>) | (() => boolean);
    private saveModuleInDatabase;
    /**
     * Has Listener
     * -------------
     *
     * @param listenerName
     */
    hasListener(listenerName: string): boolean;
    /**
     * Get Listener
     * ------------
     *
     * @param listenerName
     */
    getListener(listenerName: string): ModuleListener | undefined;
    getAllListeners(): ModuleListener[];
    getInterface(): ModuleInterface;
    /**
     * Add Multiple Listeners to this Module
     * --------------------------------------
     *
     * @param listeners
     */
    addModuleListener(...listeners: ModuleListener[]): void;
    /**
     * Return th system associated to this module
     */
    getSystem(): System;
    /**
     * Module: Data Permission
     * ---------------------------
     *
     * Inform what data permissions this module API
     * needs
     *
     */
    getModuleDataPermissions(): {
        [tableName: string]: string[];
    };
    /**
     * Get Data Requirements
     * ---------------------
     *
     * Get necessary *Data Resources* needed to run the Module!
     *
     *
     */
    getDataRequirements(): ModulePageDataRequirements;
    private getRowData;
    getId(): Promise<number>;
    /**
     * Get API Requirements
     * ---------------------
     *
     * Get necessary *Listener Actions* needed to run the Module!
     *
     */
    getApiRequirements(): ModulePageActionRequirements;
    mergeModulePageApiRequirement(req1: ModulePageActionRequirements, req2: ModulePageActionRequirements): ModulePageActionRequirements;
    mergeModulePageDataRequirement(req1: ModulePageDataRequirements, req2: ModulePageDataRequirements): ModulePageDataRequirements;
    protected abstract loadTranslations(): TranslationsByLang;
    getTranslations(): TranslationsByLang;
    handleRequest(request: ModuleRequest): Promise<any>;
    asJSON(options?: {
        exclude?: string[];
    }): ModuleJSON;
    getPageWithId(pageId: number): ModulePage;
    requestFactory: () => ModuleRequestFactoryFunction;
}
export declare type ModuleJSON = {
    system: string;
    name: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    behaviour: string;
};
export declare type TranslationsByLang = {
    [lang: string]: {
        [key: string]: string;
    };
};
export declare enum ModuleEvents {
    NAME_CHANGED = "nameChanged",
    TITLE_CHANGED = "titleChanged",
    DESCRIPTION_CHANGED = "descriptionChanged",
    ICON_CHANGED = "iconChanged",
    COLOR_CHANGED = "colorChanged"
}
