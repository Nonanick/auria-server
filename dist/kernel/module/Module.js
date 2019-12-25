"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListenerUnavaliable_1 = require("../exceptions/kernel/ListenerUnavaliable");
const ListenerRequest_1 = require("../http/request/ListenerRequest");
class Module {
    constructor(system, name) {
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
    hasListener(listenerName) {
        return this.listeners.has(listenerName);
    }
    /**
     * Get Listener
     * ------------
     *
     * @param listenerName
     */
    getListener(listenerName) {
        return this.listeners.get(listenerName);
    }
    /**
     * Add Multiple Listeners to this Module
     * --------------------------------------
     *
     * @param listeners
     */
    addListener(...listeners) {
        listeners.forEach((listener) => {
            this.listeners.set(listener.name, listener);
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
     * Inform what data permissions this module
     *
     */
    getModuleDataPermissions() {
        let tablePermissions = {};
        this.listeners.forEach((listener) => {
            let actionDefinition = listener.getExposedActionsDefinition();
            for (var actionName in actionDefinition) {
                if (actionDefinition.hasOwnProperty(actionName)) {
                    let actionReq = actionDefinition[actionName];
                    if (actionReq.tables != null) {
                        let tables = actionReq.tables;
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
        /*
        return this.system.getData().getTable(user, table);
        */
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
            if (!this.listeners.has(requestListener) && !this.listeners.has(requestListener + "Listener")) {
                throw new ListenerUnavaliable_1.ListenerUnavaliable("Requested Listener '" + requestListener + "' does not exist in this module!");
            }
            else {
                listener = this.listeners.get(requestListener) || this.listeners.get(requestListener + "Listener");
            }
            let listenerRequest = ListenerRequest_1.ListenerRequestFactory.make(request, listener);
            return listener.handleRequest(listenerRequest);
        });
    }
}
exports.Module = Module;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvTW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSxrRkFBK0U7QUFDL0UscUVBQTBGO0FBRzFGLE1BQXNCLE1BQU07SUFvRXhCLFlBQVksTUFBYyxFQUFFLElBQVk7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxZQUFvQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxZQUFvQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxHQUFHLFNBQTJCO1FBQzdDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0ksU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksd0JBQXdCO1FBQzNCLElBQUksZ0JBQWdCLEdBRWhCLEVBQUUsQ0FBQztRQUVQLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7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