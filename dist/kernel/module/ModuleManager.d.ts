import { System } from "../System";
import { Module } from "./Module";
import { ModuleListener } from "./ModuleListener";
export declare class ModuleManager {
    static getGlobalListener(module: Module, name: string): ModuleListener;
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
    constructor(system: System);
    hasModule(moduleName: string): boolean;
    addModule(...modules: Module[]): void;
    getModule(moduleName: string): Module | undefined;
    getAllModules(): Module[];
    loadModulesFromDatabase(): void;
}
