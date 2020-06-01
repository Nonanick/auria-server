var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from 'events';
import { ModuleInterface } from './interface/ModuleInterface.js';
import { ListenerUnavaliable } from '../exceptions/kernel/ListenerUnavaliable.js';
import { ListenerRequestFactory } from '../http/request/ListenerRequest.js';
export class Module extends EventEmitter {
    constructor(system, name) {
        super();
        this.system = system;
        this.name = name;
        this.interface = new ModuleInterface(this);
        this.moduleListeners = new Map();
    }
    /**
     * Name
     * -----
     *
     * Unique identifier of this module
     */
    get name() {
        return this._name;
    }
    set name(name) {
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
    get title() {
        return this._title;
    }
    set title(title) {
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
    get description() {
        return this._description;
    }
    set description(description) {
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
    get color() {
        return this._color;
    }
    set color(color) {
        this.emit(ModuleEvents.COLOR_CHANGED, color);
        this._color = color;
    }
    /**
     * Icon
     * -----
     *
     * Path to an icon in the front server
     */
    get icon() {
        return this._icon;
    }
    set icon(icon) {
        this.emit(ModuleEvents.ICON_CHANGED, icon);
        this._icon = icon;
    }
    /**
     * Has Listener
     * -------------
     *
     * @param listenerName
     */
    hasListener(listenerName) {
        return this.moduleListeners.has(listenerName);
    }
    /**
     * Get Listener
     * ------------
     *
     * @param listenerName
     */
    getListener(listenerName) {
        return this.moduleListeners.get(listenerName);
    }
    getAllListeners() {
        return Array.from(this.moduleListeners.values());
    }
    getInterface() {
        return this.interface;
    }
    /**
     * Add Multiple Listeners to this Module
     * --------------------------------------
     *
     * @param listeners
     */
    addModuleListener(...listeners) {
        listeners.forEach((listener) => {
            this.moduleListeners.set(listener.name, listener);
        });
    }
    /**
     * Return th system associated to this module
     */
    getSystem() {
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
    getModuleDataPermissions() {
        let tablePermissions = {};
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
    getTable(user, table) {
        throw new Error("Not immplemented yet!");
    }
    /**
     * Get Data Requirements
     * ---------------------
     *
     * Get necessary *Data Resources* needed to run the Module!
     *
     *
     */
    getDataRequirements() {
        let requirements = {};
        this.interface.getAllPages().forEach((page) => {
            let pageRequirements = page.getRequirements();
            if (pageRequirements.data == null)
                return;
            requirements = this.mergeModulePageDataRequirement(requirements, pageRequirements.data);
        });
        return requirements;
    }
    /**
     * Get API Requirements
     * ---------------------
     *
     * Get necessary *Listener Actions* needed to run the Module!
     *
     */
    getApiRequirements() {
        let requirements = {};
        this.interface.getAllPages().forEach((page) => {
            let pageRequirements = page.getRequirements();
            if (pageRequirements.actions == null)
                return;
            requirements = this.mergeModulePageApiRequirement(requirements, pageRequirements.actions);
        });
        return requirements;
    }
    mergeModulePageApiRequirement(req1, req2) {
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
    mergeModulePageDataRequirement(req1, req2) {
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
    getTranslations() {
        let translations = this.loadTranslations();
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
    handleRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestListener = request.getRequestStack().listener();
            let listener;
            if (!this.moduleListeners.has(requestListener) && !this.moduleListeners.has(requestListener + "Listener")) {
                throw new ListenerUnavaliable("Requested Listener '" + requestListener + "' does not exist in this module!");
            }
            else {
                listener = this.moduleListeners.get(requestListener) || this.moduleListeners.get(requestListener + "Listener");
            }
            let listenerRequest = ListenerRequestFactory.make(request, listener);
            return listener.handleRequest(listenerRequest);
        });
    }
}
export var ModuleEvents;
(function (ModuleEvents) {
    ModuleEvents["NAME_CHANGED"] = "nameChanged";
    ModuleEvents["TITLE_CHANGED"] = "titleChanged";
    ModuleEvents["DESCRIPTION_CHANGED"] = "descriptionChanged";
    ModuleEvents["ICON_CHANGED"] = "iconChanged";
    ModuleEvents["COLOR_CHANGED"] = "colorChanged";
})(ModuleEvents || (ModuleEvents = {}));
