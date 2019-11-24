"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.Module = Module;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvTW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsTUFBc0IsTUFBTTtJQW9FeEIsWUFBWSxNQUFjLEVBQUUsSUFBWTtRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLFlBQW9CO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLFlBQW9CO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLEdBQUcsU0FBMkI7UUFDN0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSx3QkFBd0I7UUFDM0IsSUFBSSxnQkFBZ0IsR0FFaEIsRUFBRSxDQUFDO1FBRVAsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNoQyxJQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQzlELEtBQUssSUFBSSxVQUFVLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ3JDLElBQUksZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUM3QyxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTt3QkFDMUIsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQzt3QkFDOUIsS0FBSyxJQUFJLFNBQVMsSUFBSSxNQUFNLEVBQUU7NEJBQzFCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQ0FDbEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQ0FDcEMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDOzZCQUNyQzt5QkFDSjtxQkFDSjtpQkFDSjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGdCQUFnQixDQUFDO0lBQzVCLENBQUM7SUFFTSxRQUFRLENBQUMsSUFBZ0IsRUFBRSxLQUFhO1FBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN6Qzs7VUFFRTtJQUNOLENBQUM7SUFJTSxlQUFlO1FBQ2xCLElBQUksWUFBWSxHQUF1QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUMvRCxLQUFLLElBQUksSUFBSSxJQUFJLFlBQVksRUFBRTtZQUMzQixJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZCxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDaEQ7YUFDSjtTQUNKO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUVKO0FBM0tELHdCQTJLQyJ9