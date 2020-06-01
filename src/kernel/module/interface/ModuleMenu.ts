import { EventEmitter } from 'events';
import { Module } from '../Module.js';
import { ModulePage, ModuleInterfacePageDescription } from './ModulePage.js';
import { ModuleMenuResourceDefinition as ModuleMenuD } from '../../resource/systemSchema/moduleMenu/ModuleMenuResourceDefinition.js';
import { ModulePageResourceDefinition as ModulePageD } from '../../resource/systemSchema/modulePage/ModulePageResourceDefinition.js';

export class ModuleMenu extends EventEmitter {

    public static fromDescription(module: Module, description: ModuleInterfaceMenuDescription): ModuleMenu {

        let nMenu = new ModuleMenu(module);

        nMenu.display = description.display;
        nMenu.displayConfig = description.display_config;
        nMenu.icon = description.icon;
        nMenu.name = description.name;
        nMenu.title = description.title;
        nMenu.url = description.url;

        if (description.menus)
            description.menus.forEach((menuDescription) => {
                nMenu.addItem(ModuleMenu.fromDescription(module, menuDescription));
            });


        if (description.pages)
            description.pages.forEach((pageDescription) => {
                nMenu.addItem(ModulePage.fromDescription(module, pageDescription));
            });

        return nMenu;
    }

    protected _name: string;
    protected _icon: string;
    protected _title: string;
    protected _color: string;
    protected _description: string;
    protected _display: string;
    protected _displayConfig: any;
    protected _url: string;
    protected _accessible: boolean;

    protected module: Module;

    protected itens: Map<string, ModuleMenu | ModulePage>;

    constructor(module: Module) {
        super();
        this.module = module;
        this.itens = new Map();
    }


    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get icon(): string {
        return this._icon;
    }

    public set icon(icon: string) {
        this._icon = icon;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get color(): string {
        return this._color;
    }

    public set color(color: string) {
        this._color = color;
    }

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get display(): string {
        return this._display;
    }

    public set display(presentation: string) {
        this._display = presentation;
    }

    public get displayConfig(): any {
        return this._displayConfig;
    }

    public set displayConfig(config: any) {
        this._displayConfig = config;
    }

    public get url(): string {
        return this._url;
    }

    public set url(url: string) {
        this._url = url;
    }

    public get accessible(): boolean {
        return this._accessible;
    }

    public set accessible(accessible: boolean) {
        this._accessible = accessible;
    }

    public addItem(...itens: (ModuleMenu | ModulePage)[]) {

        itens.forEach((item) => {
            this.itens.set(item.url, item);
        });
    }

    public async loadItensFromId(menuId: number) {
        return Promise.resolve()
            .then(_ => this.loadInterfaceMenus(menuId))
            .then(_ => this.loadInterfacePages(menuId))
    }

    private async loadInterfaceMenus(parentMenuId: number) {

        return this.module.getSystem().getSystemConnection()
            .select("*")
            .from(ModuleMenuD.tableName)
            .where("parent_menu_id", parentMenuId)
            .then(async (menus) => {
                for (var a = 0; a < menus.length; a++) {
                    let menuInfo = menus[a];
                    let menu = ModuleMenu.fromDescription(this.module, menuInfo);
                    await menu.loadItensFromId(menuInfo[ModuleMenuD.columns.ID.columnName]);
                    this.addItem(menu);
                }
            });
    }

    private async loadInterfacePages(menuId: number) {

        return this.module.getSystem().getSystemConnection()
            .select("*")
            .from(ModulePageD.tableName)
            .where("parent_menu", menuId)
            .then(async (pages) => {
                for (var a = 0; a < pages.length; a++) {
                    let pageInfo = pages[a];
                    let page = ModulePage.fromDescription(this.module, pageInfo);
                    this.addItem(page);
                }

                return this.itens;
            });
    }

    public getAllPages(): ModulePage[] {

        let allPages: ModulePage[] = [];

        this.itens.forEach((value: ModuleMenu | ModulePage) => {
            if (value instanceof ModulePage) {
                allPages.push(value);
            } else {
                allPages.concat(value.getAllPages());
            }

        });

        return allPages;
    }

    public getInterfaceDescription(): ModuleInterfaceMenuDescription {
        let description: ModuleInterfaceMenuDescription = {
            name: this.name,
            url: this.url,
            title: this.title,
            icon: this.icon,
            display: this.display,
            display_config: this.displayConfig,
            menus: [],
            pages: [],
        };

        this.itens.forEach((val) => {
            if (val instanceof ModuleMenu) {
                description.menus?.push(val.getInterfaceDescription());
            } else if (val instanceof ModulePage) {
                description.pages?.push(val.getInterfaceDescription());
            }
        });

        return description;
    }

}

export type ModuleInterfaceMenuDescription = {
    name: string;
    icon: string;
    title: string;
    url: string;
    display: string;
    display_config: any;

    menus?: ModuleInterfaceMenuDescription[],
    pages?: ModuleInterfacePageDescription[]
}