import { AccessManager } from "../../../kernel/security/AccessManager";
import { SystemUser, SystemUserPrivilege } from "../../../kernel/security/SystemUser";
import { AuriaRequest } from "../../../kernel/http/AuriaRequest";
import { UserAccessTree } from "../../../kernel/security/UserAccessTree";
import { AuriaResponse } from "../../../kernel/http/AuriaResponse";

export class CoreAccessManager extends AccessManager {

    public validateUser(user: SystemUser): boolean {
        return user.getAccessLevel() >= SystemUserPrivilege.MASTER;
    }

    public canAccessRequest(request: AuriaRequest): boolean {
        // # - User >= Sys_Admin can access ALL Modules
        if (this.listener.name == "LoginListener") {
            return true;
        } else {
            return true;//this.validateUser(this.user);
        }
    }

    public getUserAccessTree(): UserAccessTree {

        let tree: UserAccessTree = {
            modules: []
        };

        let mod = this.system.getAllModules();

        mod.forEach((module, moduleInd) => {
            tree.modules.push({
                module: module.name,
                listeners: '*'
            });
        });

        return tree;
    }

    public getListenerAction(): (req: AuriaRequest, res: AuriaResponse) => void {
        return this.action;
    }

}