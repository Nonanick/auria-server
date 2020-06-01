import { SystemUser } from "./SystemUser.js";
import { UserRole } from "../UserRole.js";
import { System } from "../../System.js";
import { UserRoleResourceDefintion as UserRoles } from "../../resource/systemSchema/userRole/UserRoleResourceDefintion.js";
import { RoleResourceDefinition as Role } from "../../resource/systemSchema/role/RoleResourceDefinition.js";

export class UserRoleManager {

    protected user: SystemUser;

    private system: System;

    /**
     * Build User Roles Promise
     * -------------------------
     * 
     * Holds the promise of the SQL query that shall 
     * build this user "Roles" and "Accessible Roles"  
     * 
     * "Roles" are roles directly assigned to this user  
     * "Accessible Roles" are roles that are underneath roles that this user owns   
     * <[Roles[], AccessibleRoles[]]>
     */
    private buildUserRolesPromise: Promise<[UserRole[], UserRole[]]>;

    private roles: UserRole[] = [];

    private canAccessRoles: UserRole[] = [];

    constructor(user: SystemUser, system: System) {

        this.system = system;
        this.user = user;

    }

    public async build() {
        if (this.buildUserRolesPromise == null) {

            this.buildUserRolesPromise = Promise.resolve()
                // # Query for user roles 
                .then(this.queryForUserRoles.bind(this))
                // # Build user roles 
                .then(this.buildUserRolesFromQueryResult.bind(this))
                // # Query for user acessible roles that are acessible through hierarchy! 
                .then(this.queryForUserAcessibleRoles.bind(this))
                // # Build and return acessible rows with user rows
                .then(this.buildUserAcessibleRolesFromQuery.bind(this));

            this.buildUserRolesPromise.catch((err) => {
                console.error("[SystemUser] Build user roles failed! " + err);
                console.error("[SystemUser] Could not build roles of user");
            });
        }

        return this.buildUserRolesPromise;
    }

    private async queryForUserRoles() {
        return Promise.resolve()
            .then(_ => {
                let conn = this.system.getSystemConnection();

                return conn
                    .select(
                        UserRoles.tableName + "._id as hire_id",
                        UserRoles.tableName + ".role_id",
                        UserRoles.tableName + ".description as hire_description",
                        Role.tableName + ".name",
                        Role.tableName + ".title as role_title",
                        Role.tableName + ".description as role_description",
                        Role.tableName + ".icon"
                    )
                    .from(UserRoles.tableName)
                    .leftJoin(
                        Role.tableName,
                        Role.tableName + "._id",
                        UserRoles.tableName + ".role_id"
                    )
                    .where(UserRoles.columns.UserID.columnName, this.user.getId());
            });
    }

    private async buildUserRolesFromQueryResult(res: any) {
        if (Array.isArray(res)) {
            res.forEach((userRoleInfo) => {
                let role = new UserRole(this.user);
                role.setInfo(userRoleInfo);
                this.roles[role.getId()] = role;
            });
            return this.roles;
        } else {
            throw new Error("[SystemUser] Failed to find roles to this user");
        }
    }

    private async queryForUserAcessibleRoles(userRoles: UserRole[]) {
        let rolesId: number[] = [];
        userRoles.forEach((val) => {
            if (val != null)
                rolesId.push(val.getId());
        });

        if (rolesId.length == 0) {
            return Promise.resolve().then(() => { return []; });
        }

        let accessRolesQuery = ` 
        WITH RECURSIVE access_roles AS (
            SELECT 
                ${Role.tableName}._id, 
                ${Role.tableName}.name, ${Role.tableName}.title, ${Role.tableName}.description, ${Role.tableName}.icon, \
                ${Role.tableName}.parent_role 
            FROM ${Role.tableName} 
            WHERE ${Role.tableName}.parent_role IS NULL AND ${Role.tableName}._id IN (` + rolesId.join(' , ') + `) \
            UNION ALL  
            SELECT 
            ${Role.tableName}._id, 
            ${Role.tableName}.name, ${Role.tableName}.title, ${Role.tableName}.description, ${Role.tableName}.icon, 
            ${Role.tableName}.parent_role 
            FROM ${Role.tableName} 
            INNER JOIN access_roles ON access_roles._id = ${Role.tableName}.parent_role 
        ) 
        SELECT * FROM access_roles`;

        let conn = this.system.getSystemConnection();

        return conn.raw(accessRolesQuery);
    }

    private async buildUserAcessibleRolesFromQuery(queryResult: any): Promise<[UserRole[], UserRole[]]> {
        return Promise.resolve()
            .then(
                () => {
                    if (Array.isArray(queryResult)) {
                        queryResult.forEach((rowInfo: UserAcessibleRowData) => {
                            let accessRole = new UserRole(this.user);

                            let roleInfo: UserRoleInformation = {
                                role_id: rowInfo._id,
                                role_description: rowInfo.description,
                                role_title: rowInfo.title,
                                icon: rowInfo.icon,
                                name: rowInfo.name
                            };

                            // If this role is one the user is hired for update its hire info
                            if (this.roles[accessRole.getId()] != null) {
                                let hiredRole: UserRole = this.roles[accessRole.getId()];
                                roleInfo.hire_description = hiredRole.getHireDescription();
                                roleInfo.hire_id = hiredRole.getHireId();
                            }

                            accessRole.setInfo(roleInfo);
                            this.canAccessRoles[accessRole.getId()] = accessRole;
                        });
                    }
                    return [this.roles, this.canAccessRoles];
                });
    }

    public async getRoles(): Promise<UserRole[]> {
        await this.build();
        return Array.from(this.roles);
    }

    public async getAccessibleRoles(): Promise<UserRole[]> {
        await this.build();
        return Array.from(this.canAccessRoles);
    }

    public async hasRole(roleId: number): Promise<boolean> {
        return this.getRoles().then(arr => arr.map(val => val.getId()).indexOf(roleId) >= 0);
    }

    public async canAccessRole(roleId: number): Promise<boolean> {
        return this.getAccessibleRoles().then(arr => arr.map(val => val.getId()).indexOf(roleId) >= 0);
    }
}


type UserAcessibleRowData = {
    _id: number;
    name: string;
    title: string;
    description: string;
    icon: string;
    parent_role: number | null;
};

export type UserRoleInformation = {
    /**
     * Hire information is optional because user can have access
     * to a role via hierarchy without being hired as this role 
     */
    hire_id?: number;
    hire_description?: string;
    /**
     * Role information is required
     */
    role_id: number;
    name: string;
    role_title: string;
    role_description: string;
    icon: string;
};