import { DatabaseModule } from "./databaseModule/DatabaseModule.js";
import { ModuleResourceDefinition as ModuleD } from "../resource/systemSchema/module/ModuleResourceDefitinion.js";
export class ModuleManager {
    constructor(system) {
        this.system = system;
        this.modules = new Map();
    }
    static getGlobalListener(module, name) {
        switch (name) {
            default:
                throw new Error("[Module Manager] Failed to load Global Listener " + name + " to module " + module.name);
        }
    }
    getBootFunction() {
        return () => this.loadModulesFromDatabase();
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
                if (oldModule instanceof DatabaseModule ||
                    mod instanceof DatabaseModule) {
                    console.log("[Module Manager] Merging module database info with coded Module");
                    // @todo merge db module with coded module
                    if (oldModule instanceof DatabaseModule) {
                        oldModule.mergeWithCodedModule(mod);
                        this.modules.set(mod.name, mod);
                    }
                    else if (mod instanceof DatabaseModule) {
                        mod.mergeWithCodedModule(oldModule);
                    }
                    else {
                        throw new Error("[Module Manager] Unreachable code, both modules are and aren't DatabaseModule instances!");
                    }
                    console.log("[Module Manager] Module that persisted the merge is: ", this.modules.get(mod.name).constructor.name);
                }
                else {
                    throw new Error("[Module Manager] Trying to add 2 modules with the same name!\
                        And none of them is from the database!\
                        Probably there are two modules with the same name on the same system!");
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
        let loaded = conn.select("_id", "name", "title", "description", "color", "icon")
            .from(ModuleD.tableName)
            .where(ModuleD.columns.Status.columnName, "active")
            .where("system", this.system.name)
            .then((result) => {
            result.forEach((modData) => {
                let dbMod = new DatabaseModule(this.system, modData.name);
                dbMod.initializeWithDbInfo(modData);
                this.addModule(dbMod);
            });
            return true;
        });
        loaded.catch((err) => {
            throw new Error("[ModuleManager] SQL Error: Failed o fetch database modules!\n" + err.message);
        });
        return loaded;
    }
}
