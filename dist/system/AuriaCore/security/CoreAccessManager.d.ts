import { AccessManager } from "../../../kernel/security/AccessManager";
import { SystemUser } from "../../../kernel/security/SystemUser";
import { AuriaRequest } from "../../../kernel/http/AuriaRequest";
import { UserAccessTree } from "../../../kernel/security/UserAccessTree";
import { AuriaResponse } from "../../../kernel/http/AuriaResponse";
export declare class CoreAccessManager extends AccessManager {
    validateUser(user: SystemUser): boolean;
    canAccessRequest(request: AuriaRequest): boolean;
    getUserAccessTree(): UserAccessTree;
    getListenerAction(): (req: AuriaRequest, res: AuriaResponse) => void;
}
