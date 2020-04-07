import { User } from "aurialib2";
import { Table } from "../database/structure/table/Table";
import { System } from "../System";
import { UserRole } from "./UserRole";
import { DataPermission } from "../module/accessPolicy/data/DataAccessPolicy";
import { SystemRequest } from "../http/request/SystemRequest";
export declare class SystemUser extends User {
    static GUEST_USERNAME: string;
    static COOKIE_USERNAME: string;
    static COOKIE_HANDSHAKE: string;
    static SESSION_EXPIRE_TIME: number;
    private _id;
    /**
     * Username
     * ---------
     *
     * Unique identifier of the user in the system
     */
    protected username: string;
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
    protected accessLevel: number;
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
    private roles;
    private canAccessRoles;
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
    private roleBadge;
    /**
     * User Information
     * ----------------
     *
     * Holdthe information stored in Auria.UserInfo about the current
     * user
     */
    private userInfo;
    private buildUserInfoPromise;
    private buildUserRolesPromise;
    /**
     *
     * Hold all the models that are beig tracked by this user
     */
    private trackingModels;
    protected dataPermission: DataPermission;
    constructor(system: System, username: string);
    getRoleBadge(): UserRole;
    setRoleBadge(badge: UserRole): this;
    trackModels(table: string, modelsId: any[]): void;
    getTrackingModelsFrom(table: string): Set<any>;
    clearTrackingModels(table: string): void;
    getAccessLevel(): number;
    setAccessLevel(level: SystemUserPrivilege): this;
    getUsername(): string;
    startSession(request: SystemRequest): void;
    buildUser(): void;
    private buildAccessPermission;
    private buildDataPermission;
    private queryForUserRoles;
    private buildUserRolesFromQueryResult;
    private queryForUserAcessibleRoles;
    private buildUserAcessibleRolesFromQuery;
    private buildUserRoles;
    getUserAgent(): string;
    setUserAgent(userAgent: string): this;
    setIp(ip: string): this;
    getUserInfo(): Promise<UserInformationData>;
    private buildUserInformation;
    setSystem(system: System): this;
    /**
     * User ID
     * ---------
     *
     * Unique identifier of the user in the system, can be set only ONCE
     * at login time
     *
     * @param _id
     */
    setId(_id: number): this;
    getId(): number;
    getLoginTime(): number;
    getUserRoles(): Promise<UserRole[]>;
    getUserRoleIds(): Promise<number[]>;
    getUserAccessRoles(): UserRole[];
    getUserAccessRoleIds(): number[];
    logout(): void;
}
export declare enum SystemUserPrivilege {
    GUEST = 0,
    NORMAL = 1,
    ADMIN = 5,
    SYSADMIN = 10,
    MASTER = 999
}
declare type UserInformationData = {
    firstname: string;
    lastname: string;
    treatment: string;
    phone: string;
    birth: string;
    avatar: string;
};
export declare type UserRoleInformation = {
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
export declare type LoginPayload = {
    username: string;
    userAgent: string;
    ip: string;
    loginTime: number;
};
export {};
