import { Module } from '../Module.js';
import { ModuleMenu } from './ModuleMenu.js';
import { ModulePage } from './ModulePage.js';
import { ModuleInterface as LibInterface, Bootable } from 'aurialib2';
import { ModuleMenuResourceDefinition as ModuleMenuDefinition } from '../../resource/systemSchema/moduleMenu/ModuleMenuResourceDefinition.js';
import { ModuleMenuRowData } from '../../resource/rowModel/ModuleMenuRowData.js';
import { ModulePageRowData } from '../../resource/rowModel/ModulePageRowData.js';
import { ModulePageResourceDefinition as ModulePageDefinition } from '../../resource/systemSchema/modulePage/ModulePageResourceDefinition.js';

export class ModuleInterface extends LibInterface implements Bootable {

    protected menus: ModuleMenu[] = [];
    protected pages: ModulePage[] = [];

    protected module: Module;

    protected loadInterfacePromise: Promise<ModuleInterfaceDescription>;

    constructor(module: Module) {
        super(module);
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {
        return async () => {
            await this.loadInterface();
            return true;
        };
    }

    protected async loadInterface(): Promise<ModuleInterfaceDescription> {
        if (this.loadInterfacePromise == null) {

            this.loadInterfacePromise =
                Promise.resolve()
                    .then(_ => this.loadInterfaceRootMenus())
                    .then(_ => this.loadInterfaceRootPages())
                    .then(_ => this.describeInterface());
        }

        return this.loadInterfacePromise;
    }

    private async loadInterfaceRootMenus() {
        return this.module.getSystem().getSystemConnection()
            .select("*")
            .from(ModuleMenuDefinition.tableName)
            .where("module_id", await this.module.getId())
            .where("parent_menu_id", null)
            .then(async (menus: ModuleMenuRowData[]) => {
                for (var a = 0; a < menus.length; a++) {
                    let menuInfo = menus[a];
                    let menu = ModuleMenu.fromDescription(this.module, menuInfo);
                    await menu.build();
                    this.addMenu(menu);
                }
                return this;
            });
    }

    private async loadInterfaceRootPages() {
        return this.module.getSystem().getSystemConnection()
            .select("*")
            .from(ModulePageDefinition.tableName)
            .where("module_id", await this.module.getId())
            .where("parent_menu", null)
            .then(async (pages) => {
                for (var a = 0; a < pages.length; a++) {
                    let pageInfo = pages[a];
                    let page = ModulePage.fromDescription(this.module, pageInfo);
                    this.addPage(page);
                }
            });
    }

    public getAllPages(recursive = true): ModulePage[] {

        let allPages: ModulePage[] = [];

        this.pages.forEach((p) => {
            console.log("[Module] Get All Pages! Will set page ", p, " with ID of ", p.id);
            allPages[p.id] = p;
        });

        if (recursive)
            this.menus.forEach((menu) => {
                menu.getAllPages(true).map((v,i) => allPages[i] = v);
            });

        return allPages;
    }

    public async describeInterface(): Promise<ModuleInterfaceDescription> {
        let itens: ModuleInterfaceDescription = {
            menus: [],
            pages: []
        };

        for (var a = 0; a < this.pages.length; a++)
            itens.pages?.push(await this.pages[a].asJSON());

        for (var a = 0; a < this.menus.length; a++)
            itens.menus?.push(await this.menus[a].asJSON());


        return itens;
    }

}

export type ModuleInterfaceDescription = {
    menus?: ModuleMenuRowData[],
    pages?: ModulePageRowData[]
};

export type ModuleInterfaceTreeBranch = {
    name: string;
    type: "Menu" | "Page";
    root: boolean;
    parent?: ModuleInterfaceTreeBranch;
    item: ModulePageRowData | ModuleMenuRowData;
}