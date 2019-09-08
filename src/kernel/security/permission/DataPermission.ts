import { SystemUser } from "../SystemUser";

export class DataPermission {

    protected user : SystemUser;

    constructor(user : SystemUser) {
        this.user = user;
    }

    
}