import { SystemUser } from "../../../security/user/SystemUser.js";


export class DataPermission {

    protected user : SystemUser;

    constructor(user : SystemUser) {
        this.user = user;
    }

    
}