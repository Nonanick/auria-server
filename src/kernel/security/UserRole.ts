import { SystemUser, UserRoleInformation } from "./SystemUser";

export class UserRole {

    protected _id: number;
    protected role_id: number;
    protected name: string;
    protected title: string;
    protected description: string;
    protected icon: string;
    protected hire_descripion: string;

    constructor(user: SystemUser) {

    }

    public getId(): number {
        return this.role_id;
    }

    public getHireId() {
        return this._id;
    }

    public getHireDescription() {
        return this.hire_descripion;
    }

    public setInfo(info: UserRoleInformation) {
        
        this.role_id = info.role_id;
        this.description = info.role_description;
        this.name = info.name;
        this.icon = info.icon;
        this.title = info.role_title;

        this.hire_descripion = info.hire_description ? info.hire_description : "";
        this._id = info.hire_id ? info.hire_id : -1;

        return this;
    }
}
