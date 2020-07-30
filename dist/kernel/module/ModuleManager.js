var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DatabaseModule } from "./databaseModule/DatabaseModule.js";
import { ModuleResourceDefinition as ModuleD } from "../resource/systemSchema/module/ModuleResourceDefitinion.js";
import { BootSequence } from "aurialib2";
import { ModuleManagerAlreadyBooted } from "../exceptions/kernel/module/ModuleManagerAlreadyBooted.js";
export class ModuleManager {
    constructor(system) {
        this.modulesById = [];
        this.system = system;
        this.modulesBoot = new BootSequence();
        this.modules = new Map();
    }
    getBootFunction() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // Await module loading from DB 
            yield this.loadModulesFromDatabase();
            // Add to module boot sequence all modules (coded/non-coded)
            this.modules.forEach((mod) => {
                this.modulesBoot.addBootable("[Module] " + mod.name, mod);
            });
            // For each added module initialize Module boot sequence
            yield this.modulesBoot.initialize();
            let modArr = Array.from(this.modules.values());
            // Load ModulesByID
            for (var a = 0; a < modArr.length; a++) {
                this.modulesById[yield modArr[a].getId()] = modArr[a];
            }
            this.__lock = true;
            return true;
        });
    }
    lock() {
        this.__lock = true;
    }
    hasModule(moduleName) {
        return this.modules.has(moduleName);
    }
    /**
     * Add Module(s)
     * -------------
     * Tries to add a module into this module manager
     *
     * !! Module adding cannot be done after boot routine!
     * An exception is raised if a module is inserted AFTER the boot routine is called
     * @param modules
     */
    addModule(...modules) {
        if (this.__lock)
            throw new ModuleManagerAlreadyBooted("[ModuleManager] Cannot add modules after boot routine!");
        modules.forEach((mod) => {
            // # - Already exists, probable conflict with DB Module + Coded Module!
            if (this.modules.has(mod.name)) {
                let oldModule = this.modules.get(mod.name);
                // Merging database module with coded module
                if (oldModule instanceof DatabaseModule || mod instanceof DatabaseModule) {
                    console.log("[Module Manager] Merging module database info with coded Module");
                    // @todo merge db module with coded module
                    if (oldModule instanceof DatabaseModule) {
                        oldModule.mergeWithCodedModule(mod);
                        this.modules.set(mod.name, mod);
                    }
                    else if (mod instanceof DatabaseModule)
                        mod.mergeWithCodedModule(oldModule);
                    else
                        throw new Error("[Module Manager] Unreachable code, both modules are and aren't DatabaseModule instances!");
                }
                else
                    throw new Error("[Module Manager] Trying to add 2 modules with the same name!\
                        And none of them is from the database!\
                        Probably there are two modules with the same name on the same system!");
            }
            else {
                this.modules.set(mod.name, mod);
            }
        });
    }
    getModule(moduleName) {
        return this.modules.get(moduleName);
    }
    getModuleById(id) {
        return this.modulesById[id];
    }
    getAllModules() {
        let modules = Array.from(this.modules.values());
        return modules;
    }
    loadModulesFromDatabase() {
        let conn = this.system.getSystemConnection();
        let loaded = conn.select("*")
            .from(ModuleD.tableName)
            .where(ModuleD.columns.Status.columnName, "active")
            .where("system", this.system.name)
            .then((modules) => {
            modules.forEach((modData) => {
                let dbMod = new DatabaseModule(this.system, modData.name);
                dbMod.initializeWithDbInfo(modData);
                this.addModule(dbMod);
            });
            return true;
        });
        loaded.catch((err) => {
            throw new Error("[ModuleManager] SQL Error: Failed to fetch database modules!\n" + err.message);
        });
        return loaded;
    }
}
//# sourceMappingURL=ModuleManager.js.map