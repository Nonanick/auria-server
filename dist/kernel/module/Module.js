"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
    getAllListeners() {
        return Array.from(this.listeners.values());
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
    getTable(user, table) {
        throw new Error("Not immplemented yet!");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvTW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBSUEsa0ZBQStFO0FBQy9FLHFFQUEwRjtBQUcxRixNQUFzQixNQUFNO0lBb0V4QixZQUFZLE1BQWMsRUFBRSxJQUFZO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxXQUFXLENBQUMsWUFBb0I7UUFDbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxXQUFXLENBQUMsWUFBb0I7UUFDbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU0sZUFBZTtRQUNsQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxHQUFHLFNBQTJCO1FBQzdDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0ksU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksd0JB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