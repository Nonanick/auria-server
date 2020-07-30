import { Module } from '../Module.js';
import { ModulePage } from './ModulePage.js';
import { ModuleMenuResourceDefinition as ModuleMenuD } from '../../resource/systemSchema/moduleMenu/ModuleMenuResourceDefinition.js';
import { ModulePageResourceDefinition as ModulePageD } from '../../resource/systemSchema/modulePage/ModulePageResourceDefinition.js';
import { ModuleMenu as LibMenu } from 'aurialib2';
import { ModuleMenuRowData } from '../../resource/rowModel/ModuleMenuRowData.js';
import { ModuleInterfaceTreeBranch } from './ModuleInterface.js';
import { ModulePageRowData } from '../../resource/rowModel/ModulePageRowData.js';

type ModuleMenuItens = {
    pages: ModulePageRowData[];
    menus: ModuleMenuRowData[];
};

export class ModuleMenu extends LibMenu {

    public static fromDescription(module: Module, description: ModuleMenuRowData): ModuleMenu {

        let nMenu = new ModuleMenu(module);

        nMenu.id = description._id;
        nMenu.icon = description.icon;
        nMenu.name = description.name;
        nMenu.title = description.title;
        nMenu.url = description.url;

        return nMenu;
    }

    protected buildItensPromise: Promise<ModuleMenuItens>;

    protected _id: number;
    protected _name: string;
    protected _icon: string;
    protected _title: string;
    protected _color: string;
    protected _description: string;
    protected _display: string;
    protected _displayConfig: any;
    protected _url: string;
    protected _accessible: boolean;

    protected pages: ModulePage[] = [];
    protected menus: ModuleMenu[] = [];

    protected module: Module;

    protected parentMenu: ModuleMenu;

    constructor(module: Module) {
        super(module.getInterface());
        this.module = module;
    }

    public get id(): number {
        return this._id;

    }

    public set id(id: number) {
        this._id = id;
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

    public async build(): Promise<ModuleMenuItens> {
        if (this.buildItensPromise == null) {
            this.buildItensPromise = this.loadItensFromId(this.id)
                .then(async _ => {
                    let itens: ModuleMenuItens = {
                        pages: [],
                        menus: [],
                    };
                    for (var a = 0; a < this.pages.length; a++)
                        itens.pages.push(await this.pages[a].asJSON());

                    for (var b = 0; b < this.menus.length; b++)
                        itens.menus.push(await this.menus[a].asJSON());

                    return itens;
                });
        }

        return this.buildItensPromise;
    }

    private async loadItensFromId(menuId: number) {
        return Promise.resolve()
            .then(_ => this.loadInterfaceMenus(menuId))
            .then(_ => this.loadInterfacePages(menuId))
    }

    private async loadInterfaceMenus(parentMenuId: number) {
        console.log("[ModuleMenu] Will now load menu that have a Parent ID of ", parentMenuId);
        return this.module.getSystem().getSystemConnection()
            .select("*")
            .from(ModuleMenuD.tableName)
            .where("parent_menu_id", parentMenuId)
            .where("module_id",await this.module.getId())
            .then(async (menus) => {
                for (var a = 0; a < menus.length; a++) {
                    console.log("[ModuleMenu] Found some menus!", menus[a]);
                    let menuInfo = menus[a];
                    let menu = ModuleMenu.fromDescription(this.module, menuInfo);
                    await menu.build();
                    menu.setParent(this);
                    this.addMenu(menu);
                }
            });
    }

    private async loadInterfacePages(menuId: number) {

        return this.module.getSystem().getSystemConnection()
            .select("*")
            .from(ModulePageD.tableName)
            .where("parent_menu", menuId)
            .where("module_id", await this.module.getId())
            .then(async (pages) => {
                for (var a = 0; a < pages.length; a++) {
                    
                    console.log("[ModuleMenu] Found some pages for this menu!", pages[a]);

                    let pageInfo = pages[a];
                    let page = ModulePage.fromDescription(this.module, pageInfo);
                    page.setParent(this);
                    this.addPage(page);
                }

                return this.pages;
            });
    }

    public getAllPages(recursive = true): ModulePage[] {

        let allPages: ModulePage[] = [];

        this.pages.forEach((value) => {
            allPages[value.id] = value;
        });

        this.menus.forEach((menu) => {
           menu.getAllPages(recursive).map((v,i) => allPages[i] = v);
        });

        return allPages;
    }

    public async getInterfaceDescription(): Promise<ModuleMenuRowData> {

        let description: ModuleMenuRowData = {
            _id: this.id,
            name: this.name,
            url: this.url,
            title: this.title,
            icon: this.icon,
            color: this.color,
            description: this.description,
            module_id: await this.module.getId(),
            parent_menu_id: this.parentMenu?.id
        };

        return description;
    }

    public async tree(): Promise<ModuleInterfaceTreeBranch> {
        let isRoot = this.parentMenu == null;
        let parent = isRoot ? undefined : await this.parentMenu.tree();

        return {
            name: this.name,
            type: "Menu",
            root: isRoot,
            parent: parent,
            item: await this.asJSON()
        }

    }

    public async asJSON(): Promise<ModuleMenuRowData> {
        return {
            _id: this.id,
            color: this.color,
            description: this.description,
            icon: this.icon,
            module_id: await this.module.getId(),
            name: this.name,
            title: this.title,
            url: this.url,
            parent_menu_id: this.parentMenu?.id
        }
    }

}