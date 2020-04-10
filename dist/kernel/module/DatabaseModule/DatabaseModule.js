"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("../Module");
const ModuleManager_1 = require("../ModuleManager");
const Translator_1 = require("../../i18n/Translator");
class DatabaseModule extends Module_1.Module {
    constructor(system, name) {
        super(system, name);
        this.name = name;
        this.fetchGlobalListeners();
    }
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
    fetchGlobalListeners() {
        let conn = this.system.getSystemConnection();
        conn
            .select("name", "title", "description")
            .from("module_listener")
            .where("module_name", this.name)
            .andWhere("active", 1)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VNb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL21vZHVsZS9EYXRhYmFzZU1vZHVsZS9EYXRhYmFzZU1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1RDtBQUl2RCxvREFBaUQ7QUFDakQsc0RBQWtEO0FBRWxELE1BQWEsY0FBZSxTQUFRLGVBQU07SUEyQnRDLFlBQVksTUFBYyxFQUFFLElBQVk7UUFDcEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBN0JEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQVcsRUFBRSxJQUFtQjtRQUU3RCxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkIsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFckIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBaUJTLG9CQUFvQjtRQUUxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFN0MsSUFBSTthQUNDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQzthQUN0QyxJQUFJLENBQUMsaUJBQWlCLENBQUM7YUFDdkIsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQy9CLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ1QsR0FBK0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUM7K0RBQ2lDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRVgsQ0FBQztJQUdNLFVBQVUsQ0FBQyxJQUFtQjtRQUVqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksVUFBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU0sb0JBQW9CLENBQUMsTUFBYztRQUN0QyxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDdEIsY0FBYyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUNoRTtJQUNMLENBQUM7SUFHUyxnQkFBZ0I7UUFDdEIsSUFBSSxZQUFZLEdBQXVCLEVBQUUsQ0FBQztRQUMxQyxZQUFZLENBQUMsc0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckMsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBNUZELHdDQTRGQyJ9