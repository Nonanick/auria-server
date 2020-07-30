import { SystemUser } from "./SystemUser.js";
import { ModulePagePermissionResourceDefinition as PagePermission } from "../../resource/systemSchema/modulePagePermission/ModulePagePermissionResourceDefinition.js";
import { System } from "../../System.js";
import { Bootable } from "aurialib2";
import { ModuleInterfaceTreeBranch } from "../../module/interface/ModuleInterface.js";
import { ModuleMenuRowData } from "../../resource/rowModel/ModuleMenuRowData.js";
import { ModulePageRowData } from "../../resource/rowModel/ModulePageRowData.js";
import { Module } from "../../module/Module.js";

export class UserInterfaceMap implements Bootable {

    private user: SystemUser;
    private system: System;

    protected accessibleModules: Module[] = [];

    private buildUserInterfaceMapPromise: Promise<ModuleInterfaceTreeBranch[]>;

    protected interfaceMap : UserInterfaceMapData;


    constructor(user: SystemUser, system: System) {
        this.user = user;
        this.system = system;
    }

    public getBootFunction(): (() => Promise<boolean>) | (() => boolean) {
        return async () => {
            await this.build();
            return true;
        };
    }

    public async build(): Promise<ModuleInterfaceTreeBranch[]> {

        if (this.buildUserInterfaceMapPromise == null) {

            this.buildUserInterfaceMapPromise =
                this.user.getUserAccessibleRoleIds()
                    .then((ids) => {

                        let user = this.user;

                        return this.system.getSystemConnection()
                            .select("page_id", "module_page.module_id")
                            .from(PagePermission.tableName)
                            // # - Check for User ID AND Role ID
                            .where(function () {
                                return this.where(PagePermission.columns.UserID.columnName, user.getId())
                                    .orWhereIn(PagePermission.columns.RoleID.columnName, ids);
                            })
                            // # - Also only in Active row's
                            .where("module_page_permission." + PagePermission.columns.Status.columnName, "active")
                            .leftJoin("module_page", "module_page._id", "page_id");

                    })
                    .then(async (pages: PageInterfacePermissionRowData[]) => {
                        let pageDescriptions: ModuleInterfaceTreeBranch[] = [];

                        for (var a = 0; a < pages.length; a++) {
                            let pageAccess = pages[a];
                            console.log("[User] User ", this.user.getUsername(), " can access : ", pageAccess);

                            let moduleId = pageAccess.module_id;
                            let module = await this.system.getModuleById(moduleId);
                            let modulePage = module.getPageWithId(pageAccess.page_id);

                            if (module != null) {
                                if (this.accessibleModules.indexOf(module) < 0) {
                                    this.accessibleModules[moduleId] = module;
                                }
                            }

                            if (modulePage != null)
                                pageDescriptions.push(await modulePage.tree());
                            else
                                console.error("Failed to find page with id ", pageAccess.module_id, "in module ", module.name);
                        }

                        return pageDescriptions;
                    });;

        }

        return this.buildUserInterfaceMapPromise;
    }

    public async asJSON(): Promise<UserInterfaceMapData> {
        return this.build()
            .then(descriptions => {
                this.interfaceMap =  {};

                this.accessibleModules.forEach((mod, id) => {
                    this.interfaceMap[id] = {
                        name: mod.name,
                        _id: id,
                        color: mod.color,
                        description: mod.color,
                        icon: mod.icon,
                        title: mod.title,
                        menus: {},
                        pages: {},
                    };
                });

                descriptions.forEach((pageDesc) => {
                    let moduleId: number = (pageDesc.item as ModulePageRowData).module_id;
                    this.mergeBanchIntoTree(pageDesc, this.interfaceMap[moduleId]);
                });

                return this.interfaceMap;
            });
    }

    private mergeBanchIntoTree(branchCrawl: ModuleInterfaceTreeBranch, root: ModuleAcessibleInterface) {
        if (branchCrawl.type == "Page") {
            let page = branchCrawl.item as ModulePageRowData;

            if (branchCrawl.root) {
                root.pages[page.name] = page;
            } else {
                let menu = this.buildMenuTree(branchCrawl.parent!, root);
                menu.pages[page.name] = page;
            }
        }
    }

    private buildMenuTree(menu: ModuleInterfaceTreeBranch, root: ModuleAcessibleInterface) {
        if (menu.root) {
            if (root.menus[menu.name] == null) {
                root.menus[menu.name] = {
                    ...{
                        pages: {},
                        menus: {}
                    },
                    ...menu.item as ModuleMenuRowData
                };
            }
            return root.menus[menu.name];
        } else {
            let parent = this.buildMenuTree(menu.parent!, root);
            if (parent!.menus[menu.name] == null) {
                parent!.menus[menu.name] = {
                    ...{
                        pages: {},
                        menus: {}
                    },
                    ...menu.item as ModuleMenuRowData
                };
            }
            return parent.menus[menu.name];
        }
    }
}

type UserInterfaceMapData = {
    [moduleId: string]: ModuleAcessibleInterface;
}

type ModuleAcessibleInterface = {
    _id: number;
    name: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    menus: {[menuName: string] : ModuleMenuRowData},
    pages: {[pageName : string] : ModulePageRowData}
}

type PageInterfacePermissionRowData = {
    page_id: number;
    module_id: number;
};