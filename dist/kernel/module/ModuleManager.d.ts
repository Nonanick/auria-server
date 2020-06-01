import { Module } from "./Module.js";
import { ModuleListener } from "./api/ModuleListener.js";
import { System } from "../System.js";
import { Bootable } from "aurialib2";
export declare class ModuleManager implements Bootable {
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
    getBootFunction(): (() => Promise<boolean>) | (() => boolean);
    hasModule(moduleName: string): boolean;
    addModule(...modules: Module[]): void;
    getModule(moduleName: string): Module | undefined;
    getAllModules(): Module[];
    loadModulesFromDatabase(): Promise<boolean>;
}
