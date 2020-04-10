"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseModule_1 = require("./DatabaseModule/DatabaseModule");
const Module_1 = require("../entity/systemEntities/module/Module");
class ModuleManager {
    constructor(system) {
        this.system = system;
        this.modules = new Map();
        this.loadModulesFromDatabase();
    }
    static getGlobalListener(module, name) {
        switch (name) {
            default:
                throw new Error("[Module Manager] Failed to load Global Listener " + name + " to module " + module.name);
        }
    }
    hasModule(moduleName) {
        return this.modules.has(moduleName);
    }
    addModule(...modules) {
        modules.forEach((mod) => {
            // # - Already exists, probable conflict with DB Module + Coded Module!
            if (this.modules.has(mod.name)) {
                let oldModule = this.modules.get(mod.name);
                // Merging database module with coded module
                if (oldModule instanceof DatabaseModule_1.DatabaseModule ||
                    mod instanceof DatabaseModule_1.DatabaseModule) {
                    console.log("[Module Manager] Merging module database info with coded Module");
                    // @todo merge db module with coded module
                    if (oldModule instanceof DatabaseModule_1.DatabaseModule) {
                        oldModule.mergeWithCodedModule(mod);
                        this.modules.set(mod.name, mod);
                    }
                    else if (mod instanceof DatabaseModule_1.DatabaseModule) {
                        mod.mergeWithCodedModule(oldModule);
                    }
                    else {
                        throw new Error("[Module Manager] Unreachable code, both modules are and aren't DatabaseModule instances!");
                    }
                    console.log("[Module Manager] Module that persisted the merge is: ", this.modules.get(mod.name).constructor.name);
                }
                else {
                    throw new Error("[Module Manager] Trying to add 2 times modules with the same name!\
                        And none of them is from the database!\
                        Possibly there are two modules with the same name on the same system!");
                }
            }
            else {
                console.log("[System] Adding module '" + mod.name + "' to system ", this.system.name);
                this.modules.set(mod.name, mod);
            }
        });
    }
    getModule(moduleName) {
        return this.modules.get(moduleName);
    }
    getAllModules() {
        let modules = Array.from(this.modules.values());
        return modules;
    }
    loadModulesFromDatabase() {
        let conn = this.system.getSystemConnection();
        conn.select("name", "title", "description", "color", "icon")
            .from(Module_1.ModuleSystemEntityName)
            .where("entry_status", "active")
            .then((result) => {
            result.forEach((modData) => {
                let dbMod = new DatabaseModule_1.DatabaseModule(this.system, modData.name);
                dbMod.setRowInfo(modData);
                this.addModule(dbMod);
            });
        }).catch((err) => {
            throw new Error("[ModuleManager] SQL Error: Failed o fetch database modules!\n" + err.message);
        });
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL01vZHVsZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxvRUFBaUU7QUFFakUsbUVBQWdGO0FBRWhGLE1BQWEsYUFBYTtJQXFCdEIsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBeEJNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsSUFBWTtRQUN4RCxRQUFRLElBQUksRUFBRTtZQUNWO2dCQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELEdBQUcsSUFBSSxHQUFHLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEg7SUFDTCxDQUFDO0lBcUJNLFNBQVMsQ0FBQyxVQUFrQjtRQUMvQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxTQUFTLENBQUMsR0FBRyxPQUFpQjtRQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDcEIsdUVBQXVFO1lBQ3ZFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUU1QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFXLENBQUM7Z0JBRXJELDRDQUE0QztnQkFDNUMsSUFDSSxTQUFTLFlBQVksK0JBQWM7b0JBQ25DLEdBQUcsWUFBWSwrQkFBYyxFQUMvQjtvQkFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7b0JBQy9FLDBDQUEwQztvQkFDMUMsSUFBSSxTQUFTLFlBQVksK0JBQWMsRUFBRTt3QkFDckMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNuQzt5QkFBTSxJQUFJLEdBQUcsWUFBWSwrQkFBYyxFQUFFO3dCQUN0QyxHQUFHLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNO3dCQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQTtxQkFDOUc7b0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1REFBdUQsRUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqSTtxQkFBTTtvQkFDSCxNQUFNLElBQUksS0FBSyxDQUNYOzs4RkFFc0UsQ0FDekUsQ0FBQztpQkFDTDthQUNKO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNuQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLFNBQVMsQ0FBQyxVQUFrQjtRQUMvQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxhQUFhO1FBQ2hCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSx1QkFBdUI7UUFFMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTdDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQzthQUN2RCxJQUFJLENBQUMsK0JBQXNCLENBQUM7YUFDNUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUM7YUFDL0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDWixNQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQXNCLEVBQUUsRUFBRTtnQkFDM0QsSUFBSSxLQUFLLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxRCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRVAsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDSjtBQWhHRCxzQ0FnR0MifQ==