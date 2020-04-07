import { AccessManager } from "../../../kernel/security/AccessManager";
import { SystemUser } from "../../../kernel/security/SystemUser";
import { UserAccessTree } from "../../../kernel/security/UserAccessTree";
import { AuriaResponse } from "../../../kernel/http/AuriaResponse";
import { ModuleRequest } from "../../../kernel/http/request/ModuleRequest";
export declare class CoreAccessManager extends AccessManager {
    validateUser(user: SystemUser): boolean;
    canAccessRequest(request: ModuleRequest): boolean;
    getUserAccessTree(): UserAccessTree;
    getListenerAction(): (req: ModuleRequest, res: AuriaResponse) => void;
}
