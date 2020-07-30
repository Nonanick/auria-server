import { Module } from "./Module.js";
import { System } from "../System.js";
import { Bootable, BootSequence } from "aurialib2";
export declare class ModuleManager implements Bootable {
    /**
     * System
     */
    private system;
    /**
     * Modules
     *
     * All modules from the system
     */
    protected modules: Map<string, Module>;
    protected modulesById: Module[];
    protected modulesBoot: BootSequence;
    private __lock;
    constructor(system: System);
    getBootFunction(): (() => Promise<boolean>) | (() => boolean);
    protected lock(): void;
    hasModule(moduleName: string): boolean;
    /**
     * Add Module(s)
     * -------------
     * Tries to add a module into this module manager
     *
     * !! Module adding cannot be done after boot routine!
     * An exception is raised if a module is inserted AFTER the boot routine is called
     * @param modules
     */
    addModule(...modules: Module[]): void;
    getModule(moduleName: string): Module | undefined;
    getModuleById(id: number): Module;
    getAllModules(): Module[];
    loadModulesFromDatabase(): Promise<boolean>;
}
