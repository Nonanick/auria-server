import { SystemRequest } from "./SystemRequest";
import { SystemUser } from "../../security/SystemUser";
export interface ModuleRequest extends SystemRequest {
    getUser: () => SystemUser;
}
export declare class ModuleRequestFactory {
    static make(request: SystemRequest, user: SystemUser): ModuleRequest;
}
