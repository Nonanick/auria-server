import { System } from "../System";
import { ModuleListener } from "./ModuleListener";
import { SystemUser } from "../security/SystemUser";
import { ModuleRequest } from "../http/request/ModuleRequest";
import { Response } from "express-serve-static-core";
export declare abstract class Module {
    /**
     * Name
     * -----
     *
     * Unique identifier of this module
     */
    name: string;
    /**
     * Title
     * ------
     *
     * Text repreenting the readable name of the title, might be used
     * as an i18n text
     *
     * @example 'Auria @{Module.Name.Title}'
     */
    title: string;
    /**
     * Description
     * -----------
     *
     * A little text that explains the general purpose of this module,
     * might be used as an i18n text
     *
     * @example 'Auria @{Module.Name.Description}
     */
    description: string;
    /**
     * Color
     * ------
     *
     * Accent color of the module, used as a visual representative
     * The color should be an string representing the RGB color as an HEX string
     *
     * @example '#098A41'
     */
    color: string;
    /**
     * Icon
     * -----
     *
     * Path to an icon in the front server
     */
    icon: string;
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
    constructor(system: System, name: string);
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
    /**
     * Add Multiple Listeners to this Module
     * --------------------------------------
     *
     * @param listeners
     */
    addListener(...listeners: ModuleListener[]): void;
    /**
     * Return th system associated to this module
     */
    getSystem(): System;
    /**
     * Module: Data Permission
     * ---------------------------
     *
     * Inform what data permissions this module
     *
     */
    getModuleDataPermissions(): {
        [tableName: string]: string[];
    };
    getTable(user: SystemUser, table: string): void;
    protected abstract loadTranslations(): TranslationsByLang;
    getTranslations(): TranslationsByLang;
    handleRequest(request: ModuleRequest, response: Response): Promise<any>;
}
export declare type TranslationsByLang = {
    [lang: string]: {
        [key: string]: string;
    };
};
