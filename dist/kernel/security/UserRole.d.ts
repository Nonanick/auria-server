import { SystemUser, UserRoleInformation } from "./SystemUser";
export declare class UserRole {
    protected _id: number;
    protected role_id: number;
    protected name: string;
    protected title: string;
    protected description: string;
    protected icon: string;
    protected hire_descripion: string;
    constructor(user: SystemUser);
    getId(): number;
    getHireId(): number;
    getHireDescription(): string;
    setInfo(info: UserRoleInformation): this;
}
