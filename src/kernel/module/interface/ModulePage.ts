import { EventEmitter } from 'events';
import { Module } from '../Module';
import { ModulePageRequirements } from './requirements/ModulePageRequirements';

export class ModulePage extends EventEmitter {


    public static fromDescription(module : Module, description : ModuleInterfacePageDescription) : ModulePage {

        let page = new ModulePage(module);


        return page;
    }

    protected _name: string;
    protected _url: string;
    protected _icon: string;
    protected _title: string;
    protected _display: string;
    protected _displayConfig: any;

    protected module: Module;

    protected requirements: ModulePageRequirements;

    constructor(module: Module) {
        super();
        this.module = module;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get url(): string {
        return this._url;
    }

    public set url(url: string) {
        this._url = url;
    }

    public get display(): string {
        return this._display;
    }

    public set display(display: string) {
        this._display = display;
    }

    public get displayConfig(): any {
        return this._displayConfig;
    }

    public set displayConfig(config: any) {
        this._displayConfig = config;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get icon(): string {
        return this._icon;
    }

    public set icon(icon: string) {
        this._icon = icon;
    }

    public getRequirements(): ModulePageRequirements {
        return this.requirements;
    }

    public getInterfaceDescription(): ModuleInterfacePageDescription {
        return {
            name: this.name,
            url: this.url,
            icon: this.icon,
            title: this.title,
            display: this.display,
            display_config: this.displayConfig
        };
    }
}

export type ModuleInterfacePageDescription = {
    name: string;
    url: string;
    icon: string;
    title: string;
    display: string;
    display_config: any;
};