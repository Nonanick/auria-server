import { ModuleInterface } from './interface/ModuleInterface.js';
import { ModulePageDataRequirements, ModulePageActionRequirements } from './interface/requirements/ModulePageRequirements.js';
import { ModulePage } from './interface/ModulePage.js';
import { ModuleListener } from './api/ModuleListener.js';
import { System } from '../System.js';
import { ModuleRequest, ModuleRequestFactory, ModuleRequestFactoryFunction } from '../http/request/ModuleRequest.js';
import { ListenerUnavaliable } from '../exceptions/kernel/ListenerUnavaliable.js';
import { ListenerRequest, ListenerRequestFactory } from '../http/request/ListenerRequest.js';
import { ModuleBehaviour, ModuleResourceDefinition } from '../resource/systemSchema/module/ModuleResourceDefitinion.js';
import { Module as LibModule, Bootable, BootSequence } from 'aurialib2';
import { ModuleRowData } from "../resource/rowModel/ModuleRowData.js";
import { ModuleRowDataMissing } from "../exceptions/kernel/module/ModuleRowDataMissing.js";

export abstract class Module extends LibModule implements Bootable {

    protected _id: number;
    protected _name: string;
    protected _title: string;
    protected _description: string;
    protected _color: string;
    protected _icon: string;

    protected rowData: ModuleRowData;
    protected rowDataPromise: Promise<ModuleRowData>;

    protected _behaviour: ModuleBehaviour = "Coded";

    /**
     * Name
     * -----
     * 
     * Unique identifier of this module
     */
    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this.emit(ModuleEvents.NAME_CHANGED, name);
        this._name = name;
    }

    /**
     * Title
     * ------
     * 
     * Text repreenting the readable name of the title, might be used
     * as an i18n text
     * 
     * @example 'Auria @{Module.Name.Title}'
     */
    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this.emit(ModuleEvents.TITLE_CHANGED, title);
        this._title = title;
    }

    /**
     * Description
     * -----------
     * 
     * A little text that explains the general purpose of this module,
     * might be used as an i18n text
     * 
     * @example 'Auria @{Module.Name.Description}
     */
    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this.emit(ModuleEvents.DESCRIPTION_CHANGED, description);
        this._description = description;
    }

    /**
     * Color
     * ------
     * 
     * Accent color of the module, used as a visual representative
     * The color should be an string representing the RGB color as an HEX string
     * 
     * @example '#098A41'
     */
    public get color(): string {
        return this._color;
    }

    public set color(color: string) {
        this.emit(ModuleEvents.COLOR_CHANGED, color);
        this._color = color;
    }

    /**
     * Icon
     * -----
     * 
     * Path to an icon in the front server
     */
    public get icon(): string {
        return this._icon;
    }

    public set icon(icon: string) {
        this.emit(ModuleEvents.ICON_CHANGED, icon);
        this._icon = icon;
    }


    public get behaviour() {
        return this._behaviour;
    }

    public set behaviour(behaviour: ModuleBehaviour) {
        this._behaviour = behaviour;
    }

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

    constructor(system: System, name: string) {
        super();

        this.system = system;
        this.name = name;
        this.moduleListeners = new Map();

        this.moduleBoot = new BootSequence();
        this.interface = new ModuleInterface(this);
        
        this.moduleBoot.addBootable("ModuleInterfaceBoot", this.interface);
        
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {

        return async () => {
            try {
                await this.getRowData();
            } catch (err) {
                if (err instanceof ModuleRowDataMissing) {
                    await this.saveModuleInDatabase();
                    delete this.rowDataPromise;
                }
            }

            await this.moduleBoot.initialize();

            return true;
        };
    }

    private async saveModuleInDatabase() {

        let moduleRowData: ModuleJSON = this.asJSON();

        return this.system.getSystemConnection()
            .insert(moduleRowData)
            .into(ModuleResourceDefinition.tableName)
            .then((insertReturn) => {
                console.log("[ModuleManager] Module register insert completed", insertReturn);
            })
            .catch((err) => {
                console.error("[ModuleManger] Failed to register module into the database!", err);
            });
    }
    /**
     * Has Listener
     * -------------
     * 
     * @param listenerName 
     */
    public hasListener(listenerName: string) {
        return this.moduleListeners.has(listenerName);
    }

    /**
     * Get Listener
     * ------------
     * 
     * @param listenerName 
     */
    public getListener(listenerName: string) {
        return this.moduleListeners.get(listenerName);
    }

    public getAllListeners(): ModuleListener[] {
        return Array.from(this.moduleListeners.values());
    }

    public getInterface(): ModuleInterface {
        return this.interface;
    }
    /**
     * Add Multiple Listeners to this Module
     * --------------------------------------
     * 
     * @param listeners 
     */
    public addModuleListener(...listeners: ModuleListener[]) {
        listeners.forEach((listener) => {
            this.moduleListeners.set(listener.name, listener);
        });
    }

    /**
     * Return th system associated to this module
     */
    public getSystem() {
        return this.system;
    }

    /**
     * Module: Data Permission
     * ---------------------------
     * 
     * Inform what data permissions this module API
     * needs
     * 
     */
    public getModuleDataPermissions() {
        let tablePermissions: {
            [tableName: string]: string[]
        } = {};

        this.moduleListeners.forEach((listener) => {
            let actionDefinition = listener.getMetadataFromExposedActions();

            for (var actionName in actionDefinition) {
                if (actionDefinition.hasOwnProperty(actionName)) {
                    let actionReq = actionDefinition[actionName];

                    if (actionReq.dataDependencies != null) {
                        let tables = actionReq.dataDependencies;

                        for (var tableName in tables) {
                            if (tables.hasOwnProperty(tableName)) {
                                let act = tables[tableName].actions;
                                tablePermissions[tableName] = act;
                            }
                        }
                    }
                }
            }
        });

        return tablePermissions;
    }

    /**
     * Get Data Requirements
     * ---------------------
     * 
     * Get necessary *Data Resources* needed to run the Module!
     * 
     * 
     */
    public getDataRequirements(): ModulePageDataRequirements {
        let requirements: ModulePageDataRequirements = {};

        this.interface.getAllPages().forEach((page: ModulePage) => {
            let pageRequirements = page.getRequirements();

            if (pageRequirements.data == null) return;

            requirements = this.mergeModulePageDataRequirement(requirements, pageRequirements.data);
        });

        return requirements;
    }

    private getRowData(): Promise<ModuleRowData> {
        if (this.rowDataPromise == null) {
            this.rowDataPromise = this.system.getSystemConnection()
                .select("*")
                .from(ModuleResourceDefinition.tableName)
                .where("name", this.name)
                .where("system", this.system.name)
                .then((rows: ModuleRowData[]) => {
                    if (rows.length == 1) {
                        return rows[0];
                    } else {
                        console.error("[Module] Could not find module DB counterpart!");
                        throw new ModuleRowDataMissing("[Module] This module does NOT contain a DB conterpart!");
                    }
                });
        }

        return this.rowDataPromise;
    }

    public async getId(): Promise<number> {
        return this.getRowData().then(data => data._id);
    }

    /**
     * Get API Requirements
     * ---------------------
     * 
     * Get necessary *Listener Actions* needed to run the Module!
     * 
     */
    public getApiRequirements(): ModulePageActionRequirements {
        let requirements: ModulePageActionRequirements = {};

        this.interface.getAllPages().forEach((page: ModulePage) => {
            let pageRequirements = page.getRequirements();
            if (pageRequirements.actions == null) return;

            requirements = this.mergeModulePageApiRequirement(requirements, pageRequirements.actions);

        });

        return requirements;
    }

    public mergeModulePageApiRequirement(req1: ModulePageActionRequirements, req2: ModulePageActionRequirements): ModulePageActionRequirements {
        let merged = Object.assign(req2);

        //# - Traverse in page listener requirements
        for (var listenerName in req1) {
            if (req1.hasOwnProperty(listenerName)) {

                // Check each listener action it needs
                let apiActions = req1[listenerName];

                // Push it whole if it previously did not exist
                if (merged[listenerName] == null) {
                    merged[listenerName] = apiActions;
                }
                // Merge uniquie values if it previously existed!
                else {
                    apiActions.forEach((action) => {
                        if (merged[listenerName].indexOf(action) < 0) {
                            merged[listenerName].push(action);
                        }
                    });
                }
            }
        }

        return merged;

    }

    public mergeModulePageDataRequirement(req1: ModulePageDataRequirements, req2: ModulePageDataRequirements): ModulePageDataRequirements {
        let merged = Object.assign(req2);

        //# - Traverse in page listener requirements
        for (var listenerName in req1) {
            if (req1.hasOwnProperty(listenerName)) {

                // Check each listener action it needs
                let apiActions = req1[listenerName];

                // Push it whole if it previously did not exist
                if (merged[listenerName] == null) {
                    merged[listenerName] = apiActions;
                }
                // Merge uniquie values if it previously existed!
                else {
                    apiActions.forEach((action) => {
                        if (merged[listenerName].indexOf(action) < 0) {
                            merged[listenerName].push(action);
                        }
                    });
                }
            }
        }

        return merged;

    }

    protected abstract loadTranslations(): TranslationsByLang;

    public getTranslations(): TranslationsByLang {
        let translations: TranslationsByLang = this.loadTranslations();
        for (var lang in translations) {
            if (translations.hasOwnProperty(lang)) {
                let t = translations[lang];
                for (var key in t) {
                    let value = t[key];
                    delete t[key];
                    t["Module." + this.name + "." + key] = value;
                }
            }
        }
        return translations;
    }

    public async handleRequest(request: ModuleRequest) {

        let requestListener: string = request.getRequestStack().listener();

        let listener: ModuleListener;
        if (!this.moduleListeners.has(requestListener) && !this.moduleListeners.has(requestListener + "Listener")) {
            throw new ListenerUnavaliable("Requested Listener '" + requestListener + "' does not exist in this module!");
        } else {
            listener = this.moduleListeners.get(requestListener)! || this.moduleListeners.get(requestListener + "Listener")!;
        }

        let listenerRequest: ListenerRequest = ListenerRequestFactory.make(request, listener);

        return listener.handleRequest(listenerRequest);

    }

    public asJSON(options?: {
        exclude?: string[],
    }): ModuleJSON {
        let ret = {
            system: this.system.name,
            behaviour: this.behaviour,
            color: this.color,
            description: this.description,
            icon: this.icon,
            name: this.name,
            title: this.title,
        };

        if (options?.exclude) {
            options.exclude.forEach((k) => {
                ret[k] = "";
            });
        }

        return ret;
    }

    public getPageWithId(pageId: number): ModulePage {
        console.log("[Module] Get page with ID ", pageId, " on ", this.interface.getAllPages());
        return this.interface.getAllPages()[pageId];
    }

    public requestFactory : () => ModuleRequestFactoryFunction = () => {
        return ModuleRequestFactory.make;
    }


}

export type ModuleJSON = {
    system: string;
    name: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    behaviour: string;
}

export type TranslationsByLang = {
    [lang: string]: {
        [key: string]: string;
    };
};

export enum ModuleEvents {
    NAME_CHANGED = "nameChanged",
    TITLE_CHANGED = "titleChanged",
    DESCRIPTION_CHANGED = "descriptionChanged",
    ICON_CHANGED = "iconChanged",
    COLOR_CHANGED = "colorChanged"
}