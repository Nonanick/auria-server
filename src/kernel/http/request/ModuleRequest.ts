import { SystemRequest } from "./SystemRequest";
import { SystemUser } from "../../security/SystemUser";

export interface ModuleRequest extends SystemRequest {

    getUser: () => SystemUser;

}

export class ModuleRequestFactory {

    public static make(request: SystemRequest, user: SystemUser): ModuleRequest {

        return Object.assign({
            getUser: () => user,
        }, request);

    }
}