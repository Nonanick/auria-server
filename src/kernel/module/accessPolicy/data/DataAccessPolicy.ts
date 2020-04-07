import { SystemUser } from "../../../security/SystemUser";

export class DataPermission {

    protected user : SystemUser;

    constructor(user : SystemUser) {
        this.user = user;
    }

    
}