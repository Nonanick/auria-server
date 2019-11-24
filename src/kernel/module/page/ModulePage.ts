import { EventEmitter } from "events";
import { Module } from "../Module";

export class ModulePage extends EventEmitter{

    private module : Module;

    constructor(module : Module) {
        super();

        this.module = module;
    }

    public getModule() : Module {
        return this.module;
    }

    public getRequiredDataAccess() {

    }

    public getRequiredApiAccess() {

    }

}