import { Module } from '../Module';
import { ModulePageRequirements } from './requirements/ModulePageRequirements';
import { ModulePage as LibPage } from 'aurialib2';
import { ModuleMenu } from './ModuleMenu.js';
import { ModuleInterfaceTreeBranch } from './ModuleInterface.js';
import { ModulePageRowData } from '../../resource/rowModel/ModulePageRowData.js';

export class ModulePage extends LibPage {


    public static fromDescription(module: Module, description: ModuleInterfacePageDescription): ModulePage {

        let page = new ModulePage(module);
        page.id = description._id;
        page.name = description.name;
        page.description = description.description;
        page.title = description.title;
        page.icon = description.icon;
        page.url = description.url;
        page

        return page;
    }

    protected _id: number;

    protected _name: string;
    protected _url: string;
    protected _icon: string;
    protected _title: string;
    protected _engine: string;
    protected _engineConfig: any;

    protected module: Module;

    protected parentMenu: ModuleMenu;

    protected requirements: ModulePageRequirements;

    constructor(module: Module) {
        super(module.getInterface());
        this.module = module;
    }

    public setParent(parent: ModuleMenu) {
        this.parentMenu = parent;
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

    public get engine(): string {
        return this._engine;
    }

    public set engine(display: string) {
        this._engine = display;
    }

    public get engineConfig(): any {
        return this._engineConfig;
    }

    public set engineConfig(config: any) {
        this._engineConfig = config;
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

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public getRequirements(): ModulePageRequirements {
        return this.requirements;
    }

    public getInterfaceDescription(): ModuleInterfacePageDescription {
        return {
            _id: this.id,
            name: this.name,
            description: this.description,
            url: this.url,
            icon: this.icon,
            title: this.title,
            engine: this.engine,
            engine_config: this.engineConfig
        };
    }

    public async tree(): Promise<ModuleInterfaceTreeBranch> {
        let isRoot = this.parentMenu == null;
        let parent = isRoot ? undefined : await this.parentMenu.tree();

        return {
            name : this.name,
            type : "Page",
            root: isRoot,
            parent: parent,
            item: await this.asJSON()
        };
    }

    public async asJSON(): Promise<ModulePageRowData> {
        return {
            _id: this.id,
            api_requirements: this.apiRequirements,
            data_requirements: this.dataRequirements,
            description: this.description,
            engine: this.engine,
            icon: this.icon,
            module_id: await this.module.getId(),
            name: this.name,
            title: this.title,
            url: this.url,
            module_binding: this.modelBinding,
            resource_binding: this.collectionBinding
        };
    }
}

export type ModuleInterfacePageDescription = {
    _id: number;
    name: string;
    description: string;
    url: string;
    icon: string;
    title: string;
    engine: string;
    engine_config: any;
};