export class UserRole {
    constructor(user) {
    }
    getId() {
        return this.role_id;
    }
    getHireId() {
        return this._id;
    }
    getHireDescription() {
        return this.hire_descripion;
    }
    setInfo(info) {
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
