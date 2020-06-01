import { User } from "aurialib2";
import { UserRole } from "../UserRole.js";
import { UserInterfaceMap } from "./UserInterfaceMap.js";
import { UserRoleManager } from "./UserRoleManager.js";
import { System } from "../../System.js";
import { UserInfoResourceDefinition as UserInfo } from "../../resource/systemSchema/userInfo/UserInfoResourceDefinition.js";
import { SystemRequest } from "../../http/request/SystemRequest.js";
import { ParameterAlreadyInitialized } from "../../exceptions/ParameterAlreadyInitialized.js";

export class SystemUser extends User {

    public static GUEST_USERNAME = "guest";

    public static SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 2;

    private _id: number;

    /**
     * Username
     * ---------
     * 
     * Unique identifier of the user in the system
     */
    protected username: string = SystemUser.GUEST_USERNAME;

    /**
     * System Name
     * ------------
     * 
     * In which system did this user logged in 
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

    /**
     * Access Token
     * ------------
     * 
     * Define this user current access token
     */
    protected accessToken: string;


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


    /**
     * 
     * Hold all the models that are beig tracked by this user
     */
    private trackingModels: Map<string, Set<any>>;

    protected userInterfaceMap: UserInterfaceMap;

    protected userRoleManager: UserRoleManager;


    constructor(system: System, username: string) {
        super();

        this.username = username;
        this.system = system;

        this.trackingModels = new Map();

        this.userInterfaceMap = new UserInterfaceMap(this, system);
        this.userRoleManager = new UserRoleManager(this, system);
    }

    public getInterfaceMap(): UserInterfaceMap {
        return this.userInterfaceMap;
    }

    public setAccessToken(token: string) {
        this.accessToken = token;
        return this;
    }

    public accessTokenMatch(token): boolean {
        return this.accessToken == token;
    }

    public getRoleBadge(): UserRole {
        return this.roleBadge;
    }

    public async setRoleBadge(badge: UserRole) {

        return this.getUserAccessibleRoleIds().then((arr) => {
            if (arr.indexOf(badge.getId()) >= 0) {
                this.roleBadge = badge;
            } else {
                console.error("[SystemUser] User cant wear a badge he does not have access to!");
            }

            return this;
        });

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

    public startSession(request: SystemRequest): void {
        if (this.loginTime == null) {

            this.loginTime = Date.now();
            this.ip = request.getIp();
            this.userAgent = request.getUserAgent();

            this.buildUser();
        } else {
            throw new ParameterAlreadyInitialized("User session already started!")
        }
    }

    public buildUser() {
        this.buildUserRoles()
            .then(([userHiredRoles, userAccessRoles]) => {
                console.log(
                    "[SystemUser] User logged in and have this roles:",
                    userHiredRoles,
                    "\nBut also hav access to this roles:",
                    userAccessRoles
                );
            });
        this.buildUserInformation()
            .catch((err) => {
                console.error("[SystemUser] Failed to fetch user information from server! Missing ID?", err);
            });

        this.buildAccessPermission();

        console.log(
            "[SystemUser] Login request ended on server side!\n",
            "Finished building user information, will probably make a promise to control the user state!",
            this.username
        );
    }

    private async buildAccessPermission() {

    }

    private async buildUserRoles() {
        return this.userRoleManager.build();
    }

    public getUserAgent(): string {
        return this.userAgent;
    }

    public setUserAgent(userAgent: string) {
        this.userAgent = userAgent;
        return this;
    }

    public setIp(ip: string) {
        this.ip = ip;
        return this;
    }

    public getIp(): string {
        return this.ip;
    }

    public async getUserInfo(): Promise<UserInformationData> {
        await this.buildUserInformation();
        return this.userInfo;
    }

    private async buildUserInformation() {
        if (this.buildUserInfoPromise == null) {
            this.buildUserInfoPromise = new Promise((resolve, reject) => {
                let conn = this.system.getSystemConnection();
                conn.select(
                    UserInfo.columns.Name.columnName,
                    UserInfo.columns.Surname.columnName,
                    UserInfo.columns.Email.columnName,
                    UserInfo.columns.Photo.columnName
                )
                    .from(UserInfo.tableName)
                    .where(UserInfo.columns.UserID.columnName, this._id)
                    .then((res) => {
                        if (Array.isArray(res)) {
                            if (res.length == 1) {
                                this.userInfo = res[0];
                                resolve(true);
                            } else {
                                reject("[SystemUser] Failed to pinpoint information about the user");
                            }
                        }
                    })
                    .catch((err) => {
                        console.error("[SystemUser] Failed to fetch user information", err);
                        reject("[SystemUser] Failed to fetch user information!");
                        delete this.buildUserInfoPromise;
                    });
            });
        }

        return this.buildUserInfoPromise;
    }

    public setSystem(system: System) {
        if (this.system == null)
            this.system = system;
        else
            throw new ParameterAlreadyInitialized("User's System has already been set!");

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
        if (this._id == null) {
            this._id = _id;
            this.buildUserInformation()
        } else {
            console.error("[SystemUser] Cannot rewrite the ID of a user!");
        }

        return this;
    }

    public getId(): number {
        return this._id;
    }

    public getLoginTime() {
        return this.loginTime;
    }

    public getLoginTimeAsDate() {
        let date = new Date();
        date.setTime(this.loginTime);
        return date;
    }

    public async getUserRoles(): Promise<UserRole[]> {
        return this.userRoleManager.getRoles();
    }

    public async getUserRoleIds(): Promise<number[]> {

        return this.userRoleManager.getRoles()
            .then((arr) => {
                return arr.map((v) => {
                    return v.getId();
                });
            });
    }

    public async getUserAccessibleRoles(): Promise<UserRole[]> {
        return this.userRoleManager.getAccessibleRoles();
    }

    public async getUserAccessibleRoleIds(): Promise<number[]> {
        return this.userRoleManager.getAccessibleRoles()
            .then((arr) => {
                return arr.map((v) => {
                    return v.getId();
                });
            });
    }

    public logout() {

        this.emit("logout", this.username);

        this.system.removeUser(this.username);

        this.username = SystemUser.GUEST_USERNAME;
        this.accessLevel = SystemUserPrivilege.GUEST;
        this.ip = "";
        this.userAgent = "";

        delete this.userRoleManager;
        delete this.userInterfaceMap;

    }

}

export enum SystemUserPrivilege {
    GUEST = 0,
    NORMAL = 1,
    ADMIN = 5,
    SYSADMIN = 10,
    MASTER = 999
}

type UserInformationData = {
    name: string;
    surname: string;
    email: string;
    photo: string;
};


export type LoginPayload = {
    username: string;
    userAgent: string;
    ip: string;
    loginTime: number;
};