import { System } from "../System";
import { Module } from "./Module";
import { ModuleRowData } from "./ModuleRowData";
import { DatabaseModule } from "./DatabaseModule/DatabaseModule";
import { ModuleListener } from "./ModuleListener";

export class ModuleManager {

    public static getGlobalListener(module: Module, name: string): ModuleListener {
        switch (name) {
            default:
                throw new Error("[Module Manager] Failed to load Global Listener " + name + " to module " + module.name);
        }
    }

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

    constructor(system: System) {
        this.system = system;
        this.modules = new Map();

        this.loadModulesFromDatabase();
    }

    public hasModule(moduleName: string) {
        return this.modules.has(moduleName);
    }

    public addModule(...module: Module[]) {
        module.forEach((mod) => {
            // # - Already exists, probable conflict with DB Module + Coded Module!
            if (this.modules.has(mod.name)) {

                let oldModule = this.modules.get(mod.name) as Module;

                // Merging database module with coded module
                if (
                    oldModule instanceof DatabaseModule ||
                    mod instanceof DatabaseModule
                ) {
                    console.log("[Module Manager] Merging module database info with coded Module");
                    // @todo merge db module with coded module
                    if (oldModule instanceof DatabaseModule) {
                        oldModule.mergeWithCodedModule(mod);
                        this.modules.set(mod.name, mod);
                    } else if (mod instanceof DatabaseModule) {
                        mod.mergeWithCodedModule(oldModule);
                    } else {
                        throw new Error("[Module Manager] Unreachable code, both modules are and aren't DatabaseModule instances!")
                    }
                    console.log("[Module Manager] Module that persisted the merge is: ", (this.modules.get(mod.name) as Module).constructor.name);
                } else {
                    throw new Error(
                        "[Module Manager] Trying to add 2 times modules with the same name!\
                        And none of them is from the database!\
                        Possibly there are two modules with the same name on the same system!"
                    );
                }
            } else {
                console.log("[System] Adding module '" + mod.name + "' to system ", this.system.name);
                this.modules.set(mod.name, mod);
            }
        });
    }

    public getModule(moduleName: string) {
        return this.modules.get(moduleName);
    }

    public getAllModules(): Module[] {
        let modules = Array.from(this.modules.values());
        return modules;
    }

    public loadModulesFromDatabase() {

        let conn = this.system.getSystemConnection();

        conn.select("name", "title", "description", "color", "icon")
            .from("module")
            .where("active", "1")
            .then((result) => {
                (result as ModuleRowData[]).forEach((modData: ModuleRowData) => {
                    let dbMod = new DatabaseModule(this.system, modData.name);
                    dbMod.setRowInfo(modData);
                    this.addModule(dbMod);
                });

            }).catch((err) => {
                throw new Error("[ModuleManager] SQL Error: Failed o fetch database modules!\n" + err.message);
            });
    }
}