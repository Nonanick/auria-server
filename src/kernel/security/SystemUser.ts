import { Table } from "../database/structure/table/Table";
import { System } from "../System";
import { AuriaRequest } from "../http/AuriaRequest";
import * as bcrypt from 'bcrypt';
import { UserRole } from "./UserRole";
import { Auria_ENV } from "../../AuriaServer";
import { User } from "aurialib2";
import { DataPermission } from "./permission/DataPermission";
import * as jwt from 'jsonwebtoken';
import { AuthConfig } from "../../config/Auth";


export class SystemUser extends User {

    public static COOKIE_USERNAME = "AURIA_UA_USERNAME";

    public static COOKIE_HANDSHAKE = "AURIA_UA_HANDSHAKE";

    public static SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 2;

    private _id: number;
    /**
     * Username
     * ---------
     * 
     * Unique identifier of the user in the system
     */
    protected username: string = "guest";

    /**
     * System Name
     * ------------
     * 
     * In which systemdid this user logged in 
     */
    protected systemName: string;

    /**
     * User Access Level
     * ------------------
     * 
     * Level of access this user possess
     */
    protected accessLevel: number = SystemUserPrivilege.GUEST;

    /**
     * Login Time
     * -----------
     * 
     * Stores date/time of the login
     */
    protected loginTime: number;

    /**
     * Last Request Time
     * ------------------
     * 
     * Stores last request date and time
     */
    protected lastRequestTime: number;

    /**
     * Transaction Token
     * ------------------
     * 
     * Transaction key token, to be used as an identifier of the user in each
     * request to this server with its username
     */
    protected transactionToken: string;

    protected userTables: Map<string, Table>;

    /**
     * System
     * --------
     * 
     * System this user belongs to
     * 
     */
    protected system: System;

    /**
     * Browser: Ip
     * ------------
     * 
     * Should not be trusted, can be easily changed!
     */
    protected ip: string;

    /**
     * Browser: User Agent
     * --------------------
     * 
     * Should not be trusted, can be easily changed
     */
    protected userAgent: string;

    /**
     * Login: Random Salt
     * -------------------
     * 
     * Adds a random number to the login request
     */
    protected randomSalt: number;

    /**
     * Handshake Token
     * ---------------
     * 
     * "Keep me logged in" token, used to retrieve a transaction token
     * without the users password, valid until the server restarts!
     * 
     * # In 'dev' it does not uses the server version therefore can be used
     * between server restarts
     */
    private handshakeToken: string;

    private roles: UserRole[];

    private canAccessRoles: UserRole[];

    /**
     * Role Badge
     * ----------
     * 
     * Choose which role will be used to create object ownership, usually
     * updated with:
     * 
     * 1. Data required role
     * 2. Action required role
     */
    private roleBadge: UserRole;

    /**
     * User Information
     * ----------------
     * 
     * Holdthe information stored in Auria.UserInfo about the current
     * user
     */
    private userInfo: UserInformationData;

    private buildUserInfoPromise: Promise<boolean>;

    private buildUserRolesPromise: Promise<[UserRole[], UserRole[]]>;

    /**
     * 
     * Hold all the models that are beig tracked by this user
     */
    private trackingModels: Map<string, Set<any>>;

    protected dataPermission: DataPermission;

    constructor(system: System, username: string) {
        super();

        this.username = username;
        this.system = system;

        this.trackingModels = new Map();
        this.userTables = new Map();
        this.roles = [];
        this.canAccessRoles = [];

    }

    public getRoleBadge(): UserRole {
        return this.roleBadge;
    }

    public setRoleBadge(badge: UserRole) {
        if (this.getUserAccessRoleIds().indexOf(badge.getId()) >= 0) {
            this.roleBadge = badge;
        } else {
            console.error("[SystemUser] User cant wear a badge he does not have access to!");
        }
        return this;
    }

    public trackModels(table: string, modelsId: any[]) {
        if (this.trackingModels.has(table)) {
            let arr = this.trackingModels.get(table) as Set<any>;
            for (var c = 0; c < modelsId.length; c++)
                arr.add(modelsId[c]);
        } else {
            this.trackingModels.set(table, new Set(modelsId));
        }
    }

    public getTrackingModelsFrom(table: string): Set<any> {
        if (this.trackingModels.get(table) != null)
            return this.trackingModels.get(table) as Set<any>;
        else
            return new Set();
    }

    public clearTrackingModels(table: string) {
        this.trackingModels.delete(table);
    }

    public getAccessLevel(): number {
        return this.accessLevel;
    }

    public setAccessLevel(level: SystemUserPrivilege) {
        this.accessLevel = level;
        return this;
    }

    public getUsername(): string {
        return this.username;
    }

    public startSession(request: AuriaRequest): void {
        this.loginTime = Date.now();
        this.ip = request.getIp();
        this.userAgent = request.getUserAgent() as string;
    }

    public buildUser() {
        this.buildUserRoles()
            .then(([userHiredRoles, userAccessRoles]) => {
                console.log(
                    "[SystemUser] User loggd in and have this roles:",
                    userHiredRoles,
                    "\nBut also hav access to this roles:",
                    userAccessRoles
                );
            });
        this.buildUserInformation();

        this.buildDataPermission();
        this.buildAccessPermission();
    }
    private async buildAccessPermission() {

    }

    private async buildDataPermission() {

        this.dataPermission = new DataPermission(this);
        return this.dataPermission;
    }

    private async queryForUserRoles() {
        return Promise.resolve().then(_ => {
            let conn = this.system.getSystemConnection();

            return conn.query(
                "SELECT \
                    user_roles._id as hire_id, user_roles.role_id, user_roles.description as hire_description, \
                    role.name, role.title as role_title, role.description as role_description, role.icon \
                    FROM user_roles \
                    LEFT JOIN role \
                    ON role._id = user_roles.role_id  \
                    WHERE username=? ",
                [this.username]);
        });
    }

    private async buildUserRolesFromQueryResult(res: any) {
        if (Array.isArray(res)) {
            res.forEach((userRoleInfo) => {
                let role = new UserRole(this);
                role.setInfo(userRoleInfo);
                this.roles[role.getId()] = role;
            });
            return this.roles;
        } else {
            throw new Error("[SystemUser] Failed to find roles to this user");
        }
    }

    private async queryForUserAcessibleRoles(userRoles: UserRole[]) {
        let accessRolesQuery = "\
        WITH RECURSIVE access_roles AS (\
            SELECT \
                role._id, \
                role.name, role.title, role.description, role.icon, \
                role.parent_role \
            FROM role \
            WHERE role.parent_role IS NULL AND role._id IN (?) \
            UNION ALL  \
            SELECT \
                role._id, \
                role.name, role.title, role.description, role.icon, \
                role.parent_role \
            FROM role \
            INNER JOIN access_roles ON access_roles._id = role.parent_role \
        ) \
        SELECT * FROM access_roles";

        let conn = this.system.getSystemConnection();
        let rolesId: number[] = [];
        userRoles.forEach((val) => {
            if (val != null)
                rolesId.push(val.getId());
        });
        return conn.query(accessRolesQuery, [rolesId]);
    }

    private async buildUserAcessibleRowsFromQuery(queryResult: any): Promise<[UserRole[], UserRole[]]> {
        return Promise.resolve()
            .then(
                () => {
                    if (Array.isArray(queryResult)) {
                        queryResult.forEach((rowInfo: UserAcessibleRowData) => {
                            let accessRole = new UserRole(this);

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

    private async buildUserRoles() {

        if (this.buildUserRolesPromise == null) {

            this.buildUserRolesPromise = Promise.resolve()
                // # Query for user roles 
                .then(this.queryForUserRoles.bind(this))
                // # Build user roles 
                .then(this.buildUserRolesFromQueryResult.bind(this))
                // # Query for user acessible roles that are acessible through hierarchy! 
                .then(this.queryForUserAcessibleRoles.bind(this))
                // # Build and return acessible rows with user rows
                .then(this.buildUserAcessibleRowsFromQuery.bind(this));

            this.buildUserRolesPromise.catch((err) => {
                console.error("[SystemUser] Build user roles failed! " + err);
                console.error("[SystemUser] Could not build roles of user");
            });
        }

        return this.buildUserRolesPromise;
    }

    public setUserAgent(userAgent: string) {
        this.userAgent = userAgent;
        return this;
    }

    public setIp(ip: string) {
        this.ip = ip;
        return this;
    }

    public async getUserInfo(): Promise<UserInformationData> {
        await this.buildUserInformation();
        return this.userInfo;
    }

    private async buildUserInformation() {
        if (this.buildUserInfoPromise == null) {
            this.buildUserInfoPromise = new Promise((resolve, reject) => {
                let conn = this.system.getSystemConnection();
                conn.query(
                    "SELECT \
                    firstname, lastname, treatment, phone, birth, avatar \
                    FROM users_info \
                    WHERE user_id=?", [this._id])
                    .then((res) => {
                        if (Array.isArray(res)) {
                            if (res.length == 1) {
                                this.userInfo = res[0];
                            } else {
                                reject("[SystemUser] Failed to pinpoint information about the user");
                            }
                        }
                    }).catch((err) => {
                        console.error("[SystemUser] Failed to fetch user information", err);
                        reject("[SystemUser] Failed to fetch user information!");
                    });
            });
        }

        return this.buildUserInfoPromise;
    }

    public async getHandshakeToken(renew?: boolean): Promise<string> {

        if (this.handshakeToken == null || renew === true) {
            this.handshakeToken = await this.renewToken();
        }

        return this.handshakeToken;

    }

    public async getTransactionToken(renew?: boolean) {

        if (this.transactionToken == null || renew === true) {
            this.transactionToken = await this.renewToken();
        }

        return this.transactionToken;
    }

    public generateTokenPayload(): LoginPayload {
        return {
            username: this.username,
            userAgent: this.userAgent,
            ip: this.ip,
            loginTime: this.loginTime,
        };
    }
    /**
     * Generate a new toke based on the user info
     *  
     * @param randomSalt User random salt to generate the token
     */
    private renewToken(randomSalt?: boolean): Promise<string> {

        let tokenHash =
            // Make sure its the same user    
            this.username +
            // Validate "same origin"
            this.ip + this.userAgent;
        // Validate "same server session"
        this.system.getSystemVersion();

        // Use a random salt
        if (randomSalt === true && Auria_ENV != "development") {
            this.randomSalt = Math.random() * 10000;
            tokenHash += randomSalt;
        }

        let promise = new Promise<string>((resolve, reject) => {
            bcrypt.hash(tokenHash, 10).then((hash) => {
                resolve(hash);
            }).catch((error) => {
                console.error("[SystemUser] Failed to create token!", error);
                reject("[SystemUser] Failed to renew hash");
            });
        });

        return promise;
    }

    public setSystem(system: System) {
        this.system = system;
        return this;
    }

    /**
     * User ID
     * ---------
     * 
     * Unique identifier of the user in the system, can be set only ONCE
     * at login time
     * 
     * @param _id 
     */
    public setId(_id: number) {
        if (this._id == null)
            this._id = _id;

        return this;
    }

    public getId(): number {
        return this._id;
    }

    public async getUserRoles(): Promise<UserRole[]> {
        await this.buildUserRoles();

        return this.roles;
    }

    public async getUserRoleIds(): Promise<number[]> {
        await this.buildUserRoles();

        return this.roles.map((v) => {
            return v.getId();
        });
    }

    public getUserAccessRoles(): UserRole[] {
        return this.canAccessRoles;
    }

    public getUserAccessRoleIds(): number[] {
        return this.canAccessRoles.map((v) => {
            return v.getId();
        });
    }

    public async validateHandshake(request: AuriaRequest, handshake: string): Promise<boolean> {

        let payload = jwt.verify(handshake, AuthConfig.jwtSecret) as LoginPayload;
        if (
            request.getUserAgent() == payload.userAgent
            && request.getIp() == payload.ip
            && payload.loginTime + 1000 * 60 * 60 * 24 * 2 > Date.now()
        ) {
            return true;
        }

        console.log("[SystemUser] Invalid payload!", payload);

        return false;
    }

    /**
     * Login with Password
     * --------------------
     * 
     * Tries to login this user using the provided username
     * + password, if this succeeds this user will no longer be
     * a "guest" and will be able to access the system as a logged 
     * user
     * 
     * @param username 
     * @param password 
     */
    public async loginWithPassword(username: string, password: string): Promise<boolean> {

        let promise = Promise.resolve()
            .then(() => {
                let conn = this.system.getSystemConnection();
                return conn.query("SELECT _id, password, user_type FROM users WHERE username=?", [username]);
            })
            .then(async (results: UserLoginWithPassword[]) => {
                if (results.length === 1) {
                    let u = results[0];
                    let success = await bcrypt.compare(password, u.password);
                    if (success) {
                        // # - Add User to System
                        this.username = username;
                        this.setAccessLevel(u.user_type);
                        this.setId(u._id);
                        this.system.addUser(this);
                        return true;
                    } else {
                        console.log("Failed to authenticate user " + username + " hash should be: ");
                        bcrypt.hash(password, 10, (err, hash) => {
                            console.log("Gen Hash: ", hash);
                        });
                        return false;
                    }
                } else {
                    throw new Error("[Login] Failed to pinpoint user in the database!");
                }
            });

        promise.catch((err) => {
            console.error("[Login] Failed to search for the user in the database!\n" + err);
        });

        return promise;
    }

    public async loginWithPayload(payload: LoginPayload) {
        if (payload.userAgent == this.userAgent && payload.ip == this.ip) {
            this.loginTime = payload.loginTime;
            this.username = payload.username;
            return Promise.resolve()
                .then(_ => {
                    return this.system.getSystemConnection()
                        .query("SELECT _id, user_type FROM users WHERE username=?", [this.username]);
                })
                .then(res => {
                    if (res.length != 1)
                        throw new Error("Failed to locate user in database");
                    return res[0];
                })
                .then(user => {
                    this.setAccessLevel(user['user_type'])
                        .setId(user['_id']);
                    this.system.addUser(this);
                    return true;
                });
        } else {
            throw new Error("[SystemUser] Invalid payload, cannot login user!");
        }


    }

    public verifyLoginPayload(payload: LoginPayload): boolean {
        if (
            this.username === payload.username
            && this.userAgent === payload.userAgent
            && this.ip === payload.ip
        ) {
            if (payload.loginTime + SystemUser.SESSION_EXPIRE_TIME < Date.now()) {
                console.error("[SystemUser] Session expired!");
                return false;
            }
            return true;
        } else {
            console.error("[SystemUser] Invalid payload, does not match with logged user", payload);
            return false;
        }
    }

    public logout() {

        this.emit("logout", this.username);

        this.system.removeUser(this.username);

        this.roles = [];
        this.username = "guest";
        this.accessLevel = SystemUserPrivilege.GUEST;
        this.canAccessRoles = [];



    }

}

export enum SystemUserPrivilege {
    GUEST = 0,
    NORMAL = 1,
    ADMIN = 5,
    SYSADMIN = 10,
    MASTER = 999
}

type UserAcessibleRowData = {
    _id: number;
    name: string;
    title: string;
    description: string;
    icon: string;
    parent_role: number | null;
};

type UserLoginWithPassword = {
    _id: number;
    password: string;
    user_type: number;
};

type UserInformationData = {
    firstname: string;
    lastname: string;
    treatment: string;
    phone: string;
    birth: string;
    avatar: string;
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

export type LoginPayload = {
    username: string;
    userAgent: string;
    ip: string;
    loginTime: number;
};