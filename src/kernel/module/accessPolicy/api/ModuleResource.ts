import { EventEmitter } from 'events';
import { Module } from '../../Module';

export class ModuleResource extends EventEmitter {

    protected module: Module;

    protected name: string;
    
    constructor(module: Module, name: string) {
        super();

        this.module = module;
        this.name = name;

    }

    public getName() : string {
        return this.name;
    }
}