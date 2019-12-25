"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseModule_1 = require("./DatabaseModule/DatabaseModule");
class ModuleManager {
    static getGlobalListener(module, name) {
        switch (name) {
            default:
                throw new Error("[Module Manager] Failed to load Global Listener " + name + " to module " + module.name);
        }
    }
    constructor(system) {
        this.system = system;
        this.modules = new Map();
        this.loadModulesFromDatabase();
    }
    hasModule(moduleName) {
        return this.modules.has(moduleName);
    }
    addModule(...module) {
        module.forEach((mod) => {
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
            .from("module")
            .where("active", "1")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL01vZHVsZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxvRUFBaUU7QUFHakUsTUFBYSxhQUFhO0lBRWYsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxJQUFZO1FBQ3hELFFBQVEsSUFBSSxFQUFFO1lBQ1Y7Z0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsR0FBRyxJQUFJLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoSDtJQUNMLENBQUM7SUFjRCxZQUFZLE1BQWM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXpCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFTSxTQUFTLENBQUMsVUFBa0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sU0FBUyxDQUFDLEdBQUcsTUFBZ0I7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ25CLHVFQUF1RTtZQUN2RSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFFNUIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBVyxDQUFDO2dCQUVyRCw0Q0FBNEM7Z0JBQzVDLElBQ0ksU0FBUyxZQUFZLCtCQUFjO29CQUNuQyxHQUFHLFlBQVksK0JBQWMsRUFDL0I7b0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO29CQUMvRSwwQ0FBMEM7b0JBQzFDLElBQUksU0FBUyxZQUFZLCtCQUFjLEVBQUU7d0JBQ3JDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbkM7eUJBQU0sSUFBSSxHQUFHLFlBQVksK0JBQWMsRUFBRTt3QkFDdEMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUN2Qzt5QkFBTTt3QkFDSCxNQUFNLElBQUksS0FBSyxDQUFDLDBGQUEwRixDQUFDLENBQUE7cUJBQzlHO29CQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsdURBQXVELEVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakk7cUJBQU07b0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FDWDs7OEZBRXNFLENBQ3pFLENBQUM7aUJBQ0w7YUFDSjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbkM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxTQUFTLENBQUMsVUFBa0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sYUFBYTtRQUNoQixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNoRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU0sdUJBQXVCO1FBRTFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUU3QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7YUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUNkLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO2FBQ3BCLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ1osTUFBMEIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFzQixFQUFFLEVBQUU7Z0JBQzNELElBQUksS0FBSyxHQUFHLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztRQUVQLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywrREFBK0QsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkcsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0o7QUFoR0Qsc0NBZ0dDIn0=