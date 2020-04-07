import { System } from "../System";
import { ModuleListener } from "./ModuleListener";
import { SystemUser } from "../security/SystemUser";
import { ModuleRequest } from "../http/request/ModuleRequest";
import { ListenerUnavaliable } from "../exceptions/kernel/ListenerUnavaliable";
import { ListenerRequest, ListenerRequestFactory } from "../http/request/ListenerRequest";
import { Response } from "express-serve-static-core";

export abstract class Module {

    /**
     * Name
     * -----
     * 
     * Unique identifier of this module
     */
    public name: string;

    /**
     * Title
     * ------
     * 
     * Text repreenting the readable name of the title, might be used
     * as an i18n text
     * 
     * @example 'Auria @{Module.Name.Title}'
     */
    public title: string;

    /**
     * Description
     * -----------
     * 
     * A little text that explains the general purpose of this module,
     * might be used as an i18n text
     * 
     * @example 'Auria @{Module.Name.Description}
     */
    public description: string;

    /**
     * Color
     * ------
     * 
     * Accent color of the module, used as a visual representative
     * The color should be an string representing the RGB color as an HEX string
     * 
     * @example '#098A41'
     */
    public color: string;

    /**
     * Icon
     * -----
     * 
     * Path to an icon in the front server
     */
    public icon: string;

    /**
     * System
     * -------
     * 
     * System that hold this module
     */
    protected system: System;

    /**
     * Listener
     * --------
     * 
     * All the listeners assigned to this module
     */
    protected listeners: Map<string, ModuleListener>;


    constructor(system: System, name: string) {
        this.system = system;
        this.name = name;

        this.listeners = new Map();
    }

    /**
     * Has Listener
     * -------------
     * 
     * @param listenerName 
     */
    public hasListener(listenerName: string) {
        return this.listeners.has(listenerName);
    }

    /**
     * Get Listener
     * ------------
     * 
     * @param listenerName 
     */
    public getListener(listenerName: string) {
        return this.listeners.get(listenerName);
    }

    public getAllListeners(): ModuleListener[] {
        return Array.from(this.listeners.values());
    }

    /**
     * Add Multiple Listeners to this Module
     * --------------------------------------
     * 
     * @param listeners 
     */
    public addListener(...listeners: ModuleListener[]) {
        listeners.forEach((listener) => {
            this.listeners.set(listener.name, listener);
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
     * Inform what data permissions this module
     * 
     */
    public getModuleDataPermissions() {
        let tablePermissions: {
            [tableName: string]: string[]
        } = {};

        this.listeners.forEach((listener) => {
            let actionDefinition = listener.getExposedActionsMetadata();

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

    public getTable(user: SystemUser, table: string) {
        throw new Error("Not immplemented yet!");
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

    public async handleRequest(request: ModuleRequest, response: Response) {

        let requestListener: string = request.getRequestStack().listener();

        let listener: ModuleListener;
        if (!this.listeners.has(requestListener) && !this.listeners.has(requestListener + "Listener")) {
            throw new ListenerUnavaliable("Requested Listener '" + requestListener + "' does not exist in this module!");
        } else {
            listener = this.listeners.get(requestListener)! || this.listeners.get(requestListener + "Listener")!;
        }

        let listenerRequest: ListenerRequest = ListenerRequestFactory.make(request, listener);

        return listener.handleRequest(listenerRequest);

    }

}

export type TranslationsByLang = {
    [lang: string]: {
        [key: string]: string;
    };
};