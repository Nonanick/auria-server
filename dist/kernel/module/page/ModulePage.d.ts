/// <reference types="node" />
import { EventEmitter } from "events";
import { Module } from "../Module";
export declare class ModulePage extends EventEmitter {
    private module;
    constructor(module: Module);
    getModule(): Module;
    getRequiredDataAccess(): void;
    getRequiredApiAccess(): void;
}
