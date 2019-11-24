import { AccessManager } from "./security/AccessManager";
import { SystemUser } from "./security/SystemUser";
import { AuriaServer } from "../AuriaServer";
import { ModuleManager } from "./module/ModuleManager";
import { Module } from "./module/Module";
import { MysqlConnection } from "./database/connection/MysqlConnection";
import { DataType } from "./database/structure/dataType/DataType";
import { DataSteward } from "aurialib2";
import { SystemRequest } from "./http/request/SystemRequest";
import { Response, NextFunction } from "express-serve-static-core";
import { SystemAuthenticator } from "./security/auth/SystemAuthenticator";
export declare const DEFAULT_LANG = "en";
export declare const DEFAULT_LANG_VARIATION = "us";
export declare abstract class System {
    /**
     * System name
     * Unique identifier of this system
     */
    name: string;
    /**
     * All System users that made contact with the server
     */
    protected users: Map<string, SystemUser>;
    /**
     * System 'version', generated each time the server is started
     * preventing old clients from connecting with new server instances
     *
     */
    protected systemVersion: number;
    /**
     * Server instance
     */
    protected server: AuriaServer;
    /**
     * Module manager
     *
     * Hold all the modules from this system merging database parameters
     * with coded parts of the module
     */
    protected moduleManager: ModuleManager;
    /**
     * System connection
     * ------------------
     *
     */
    protected connection: MysqlConnection;
    /**
     * Data Steward
     * -------------
     *
     */
    protected dataSteward: DataSteward;
    /**
     * Translations
     *
     * Hold all the loaded translations from this server
     */
    protected loadedTranslations: {
        [langVariation: string]: any;
    };
    constructor(server: AuriaServer, name: string);
    getDataType(name: string): DataType;
    /**
     * Build all modules from this system
     *
     * This function is called one time at server startup!
     *
     */
    protected abstract buildSystemModules(): Map<string, Module>;
    /**
     * Public access to this system modules instances
     */
    abstract getSystemModules(): Map<string, Module>;
    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): MysqlConnection;
    /**
     * Public access to this system database connection
     */
    abstract getSystemConnection(): MysqlConnection;
    /**
     * Public access to this system access manager
     */
    abstract getSystemAccessManager(): AccessManager;
    abstract getAuthenticator(): SystemAuthenticator;
    addUser(user: SystemUser): System;
    getSystemVersion(): number;
    getServer(): AuriaServer;
    hasModule(moduleName: string): boolean;
    addModule(...module: Module[]): void;
    getModule(moduleName: string): Module | undefined;
    getAllModules(): Module[];
    getUser(username: string): SystemUser | null;
    removeUser(username: string): boolean;
    getConnection(connId: number): void;
    handleRequest(request: SystemRequest, response: Response, next: NextFunction): Promise<void>;
}
