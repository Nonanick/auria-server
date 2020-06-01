import { SystemUser } from "./SystemUser.js";
import { ModulePagePermissionResourceDefinition as PagePermission } from "../../resource/systemSchema/modulePagePermission/ModulePagePermissionResourceDefinition.js";
import { System } from "../../System.js";
import { Bootable } from "aurialib2";

export class UserInterfaceMap implements Bootable {

    private user: SystemUser;
    private system: System;

    private buildUserInterfaceMapPromise: Promise<any>;

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

    public async build() {

        if (this.buildUserInterfaceMapPromise == null) {

            this.user.getUserAccessibleRoleIds()
                .then((ids) => {

                    let user = this.user;

                    this.system.getSystemConnection()
                        .select("page_id", "module_page.module_id")
                        .from(PagePermission.tableName)
                        // # - Check for User ID AND Role ID
                        .where(function () {
                            return this.where(PagePermission.columns.UserID.columnName, user.getId())
                                .orWhereIn(PagePermission.columns.RoleID.columnName, ids);
                        })
                        // # - Also only in Active row's
                        .where("module_page_permission." + PagePermission.columns.Status.columnName, "active")
                        .leftJoin("module_page","module_page._id","page_id")
                        .then((pages: PageInterfacePermissionRowData[]) => {
                            console.log("[UserInterfaceMap] User have access to pages: ", pages);
                        });
                    this.user.getUsername();
                });


        }

        return this.buildUserInterfaceMapPromise;
    }
}

type PageInterfacePermissionRowData = {
    page_id: number;
    module_id : number;
};