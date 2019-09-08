/// <reference types="node" />
import { Table } from "../database/structure/table/Table";
import { System } from "../System";
import { AuriaRequest } from "../http/AuriaRequest";
import { UserRole } from "./UserRole";
import { EventEmitter } from "events";
import { DataPermission } from "./permission/DataPermission";
export declare class SystemUser extends EventEmitter {
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
     * In which systemdid this user logged in
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
    private handshakeToken;
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
    startSession(request: AuriaRequest): void;
    buildUser(): void;
    private buildAccessPermission;
    private buildDataPermission;
    private queryForUserRoles;
    private buildUserRolesFromQueryResult;
    private queryForUserAcessibleRoles;
    private buildUserAcessibleRowsFromQuery;
    private buildUserRoles;
    setUserAgent(userAgent: string): this;
    setIp(ip: string): this;
    getUserInfo(): Promise<UserInformationData>;
    private buildUserInformation;
    getHandshakeToken(renew?: boolean): Promise<string>;
    getTransactionToken(renew?: boolean): Promise<string>;
    generateTokenPayload(): LoginPayload;
    /**
     * Generate a new toke based on the user info
     *
     * @param randomSalt User random salt to generate the token
     */
    private renewToken;
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
    getUserRoles(): Promise<UserRole[]>;
    getUserRoleIds(): Promise<number[]>;
    getUserAccessRoles(): UserRole[];
    getUserAccessRoleIds(): number[];
    validateHandshake(request: AuriaRequest, handshake: string): Promise<boolean>;
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
    loginWithPassword(username: string, password: string): Promise<boolean>;
    loginWithPayload(payload: LoginPayload): Promise<boolean>;
    verifyLoginPayload(payload: LoginPayload): boolean;
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
