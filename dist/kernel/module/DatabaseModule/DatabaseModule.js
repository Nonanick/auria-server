"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("../Module");
const ModuleManager_1 = require("../ModuleManager");
const Translator_1 = require("../../i18n/Translator");
class DatabaseModule extends Module_1.Module {
    /**
     * Populate a Module with information coming from the database
     *
     * @param mod Module to be populated
     * @param info Information that came from the query
     */
    static setRowInfoToModule(mod, info) {
        mod.title = info.title;
        mod.description = info.description;
        mod.color = info.color;
        mod.icon = info.icon;
        return mod;
    }
    constructor(system, name) {
        super(system, name);
        this.name = name;
        this.fetchGlobalListeners();
    }
    fetchGlobalListeners() {
        let conn = this.system.getSystemConnection();
        conn.query("SELECT name, title, description \
            FROM module_listener \
            WHERE module_name=? AND active=?", [this.name, 1])
            .then((res) => {
            res.forEach((listInfo) => {
                let list = ModuleManager_1.ModuleManager.getGlobalListener(this, listInfo.name);
                console.log("[Database Module] Loading Global Listener: ", list.constructor.name);
                this.addListener(list);
            });
        })
            .catch((err) => {
            console.error("[Database Module] SQL Query Error:\n \
            Failed to fetch global module listeners to module ", this.name);
        });
    }
    setRowInfo(info) {
        this.rowInfo = info;
        DatabaseModule.setRowInfoToModule(this, info);
        return this;
    }
    /**
     * Return table row data that was used to create this database module
     * might be null if this database was not initialized via a table row
     *
     */
    getRowInfo() {
        return this.rowInfo;
    }
    mergeWithCodedModule(module) {
        // # - Apply listeners
        this.listeners.forEach((list) => {
            module.addListener(list);
        });
        // # - Apply Properties
        if (this.rowInfo != null) {
            DatabaseModule.setRowInfoToModule(module, this.getRowInfo());
        }
    }
    loadTranslations() {
        let translations = {};
        translations[Translator_1.Languages.English] = {};
        return translations;
    }
}
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VNb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL21vZHVsZS9EYXRhYmFzZU1vZHVsZS9EYXRhYmFzZU1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1RDtBQUl2RCxvREFBaUQ7QUFDakQsc0RBQWtEO0FBRWxELE1BQWEsY0FBZSxTQUFRLGVBQU07SUFHdEM7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBVyxFQUFFLElBQW1CO1FBRTdELEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbkMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUVyQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFVRCxZQUFZLE1BQWMsRUFBRSxJQUFZO1FBQ3BDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVTLG9CQUFvQjtRQUUxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFN0MsSUFBSSxDQUFDLEtBQUssQ0FDTjs7NkNBRWlDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pELElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ1QsR0FBK0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUM7K0RBQ2lDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRVgsQ0FBQztJQUdNLFVBQVUsQ0FBQyxJQUFtQjtRQUVqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksVUFBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU0sb0JBQW9CLENBQUMsTUFBYztRQUN0QyxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDdEIsY0FBYyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUNoRTtJQUNMLENBQUM7SUFHUyxnQkFBZ0I7UUFDdEIsSUFBSSxZQUFZLEdBQXVCLEVBQUUsQ0FBQztRQUMxQyxZQUFZLENBQUMsc0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckMsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBM0ZELHdDQTJGQyJ9