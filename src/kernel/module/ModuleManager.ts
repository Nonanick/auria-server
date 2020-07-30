import { DatabaseModule } from "./databaseModule/DatabaseModule.js";
import { Module } from "./Module.js";
import { System } from "../System.js";
import { ModuleResourceDefinition as ModuleD } from "../resource/systemSchema/module/ModuleResourceDefitinion.js";
import { Bootable, BootSequence } from "aurialib2";
import { ModuleRowData } from "../resource/rowModel/ModuleRowData.js";
import { ModuleManagerAlreadyBooted } from "../exceptions/kernel/module/ModuleManagerAlreadyBooted.js";

export class ModuleManager implements Bootable {

    /**
     * System
     */
    private system: System;

    /**
     * Modules
     * 
     * All modules from the system
     */
    protected modules: Map<string, Module>;

    protected modulesById : Module[] = [];

    protected modulesBoot: BootSequence;

    private __lock: boolean;

    constructor(system: System) {
        this.system = system;
        this.modulesBoot = new BootSequence();
        this.modules = new Map();
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {
        return async () => {
            // Await module loading from DB 
            await this.loadModulesFromDatabase();

            // Add to module boot sequence all modules (coded/non-coded)
            this.modules.forEach((mod) => {
                this.modulesBoot.addBootable("[Module] " + mod.name, mod);
            });

            // For each added module initialize Module boot sequence
            await this.modulesBoot.initialize();

            let modArr = Array.from(this.modules.values());
            // Load ModulesByID
            for(var a=0;a<modArr.length;a++) {
                this.modulesById[await modArr[a].getId()] = modArr[a];
            }

            this.__lock = true;

            return true;
        }
    }

    protected lock() {
        this.__lock = true;
    }

    public hasModule(moduleName: string) {
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
    public addModule(...modules: Module[]) {

        if(this.__lock) 
            throw new ModuleManagerAlreadyBooted("[ModuleManager] Cannot add modules after boot routine!");
        
        modules.forEach((mod) => {

            // # - Already exists, probable conflict with DB Module + Coded Module!
            if (this.modules.has(mod.name)) {

                let oldModule = this.modules.get(mod.name) as Module;

                // Merging database module with coded module
                if (oldModule instanceof DatabaseModule || mod instanceof DatabaseModule) {
                    console.log("[Module Manager] Merging module database info with coded Module");

                    // @todo merge db module with coded module
                    if (oldModule instanceof DatabaseModule) {
                        oldModule.mergeWithCodedModule(mod);
                        this.modules.set(mod.name, mod);
                    } else if (mod instanceof DatabaseModule)
                        mod.mergeWithCodedModule(oldModule);
                    else
                        throw new Error("[Module Manager] Unreachable code, both modules are and aren't DatabaseModule instances!")

                } else
                    throw new Error(
                        "[Module Manager] Trying to add 2 modules with the same name!\
                        And none of them is from the database!\
                        Probably there are two modules with the same name on the same system!"
                    );

            } else {
                this.modules.set(mod.name, mod);
            }

        });
    }

    public getModule(moduleName: string) {
        return this.modules.get(moduleName);
    }

    public getModuleById(id : number) {
        return this.modulesById[id];
    }

    public getAllModules(): Module[] {
        let modules = Array.from(this.modules.values());
        return modules;
    }

    public loadModulesFromDatabase() {

        let conn = this.system.getSystemConnection();

        let loaded = conn.select("*")
            .from(ModuleD.tableName)
            .where(ModuleD.columns.Status.columnName, "active")
            .where("system", this.system.name)
            .then((modules: ModuleRowData[]) => {
                modules.forEach((modData: ModuleRowData) => {
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