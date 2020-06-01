import { Module } from '../Module.js';
import { ModuleMenu, ModuleInterfaceMenuDescription } from './ModuleMenu.js';
import { ModuleInterfacePageDescription } from './ModulePage.js';

export class ModuleInterface extends ModuleMenu {

    constructor(module: Module) {
        super(module);

        this.name = `[${module.name}] ModuleInterfaceRoot`;
        this.icon = this.module.icon;

        this.buildInterface();
    }

    protected buildInterface() {
        
    }

    public describeInterface() : ModuleInterfaceDescription {
        return this.getInterfaceDescription();
    }

}

export type ModuleInterfaceDescription = {
    menus? : ModuleInterfaceMenuDescription[],
    pages? : ModuleInterfacePageDescription[]
};