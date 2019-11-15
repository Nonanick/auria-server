import { AccessManager } from "./security/AccessManager";
import { SystemUser } from "./security/SystemUser";
import { AuriaServer, Auria_ENV } from "../AuriaServer";
import { SystemModule } from "./module/SystemModule/SystemModule";
import { ModuleManager } from "./module/ModuleManager";
import { Module } from "./module/Module";
import { AuthModule } from "./module/AuthModule/AuthModule";
import { Translator } from "./i18n/Translator";
import { MysqlConnection } from "./database/connection/MysqlConnection";
import { DataType } from "./database/structure/dataType/DataType";
import { DataTypeRepository } from "./database/structure/dataType/DataTypeRepository";
import { DataSteward } from "aurialib2";

export const DEFAULT_LANG = "en";
export const DEFAULT_LANG_VARIATION = "us";

export abstract class System {

    /**
     * System name
     * Unique identifier of this system
     */
    public name: string;

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
     * Translator
     * 
     * 
     */
    protected translator: Translator;

    /**
     * System connection
     * 
     * 
     */
    protected connection: MysqlConnection;

    /**
     * Data Steward
     * -------------
     * 
     */
    protected dataSteward : DataSteward;

    /**
     * Translations
     * 
     * Hold all the loaded translations from this server
     */
    protected loadedTranslations: {
        [langVariation: string]: any
    } = {};

    constructor(server: AuriaServer, name: string) {
        this.name = name;
        this.server = server;

        console.log("[System] Creating new system: ", name);

        this.connection = this.buildSystemConnection();

        this.translator = new Translator(this);
        this.moduleManager = new ModuleManager(this);
        
        // If ENV == "development", systemversion does not change!
        if(Auria_ENV == "development")
            this.systemVersion = 1;
        else 
            this.systemVersion = Math.round(Math.random() * 1000000);

        this.users = new Map();

        console.log("[System] Initializing modules from system ", name);

        this.addModule(
            // # - Authentication Module
            new AuthModule(this),

            // # - System related functions Module
            new SystemModule(this)
        );
    }

    public getDataType(name : string) : DataType {
        return DataTypeRepository[name];
    }

    /**
     * Get the system translator
     * 
     */
    public getTranslator(): Translator {
        return this.translator;
    }

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
    public abstract getSystemModules(): Map<string, Module>;

    /**
     * Build access to this system auria connection
     */
    protected abstract buildSystemConnection(): MysqlConnection;

    /**
     * Public access to this system database connection
     */
    public abstract getSystemConnection(): MysqlConnection;

    /**
     * Public access to this system access manager
     */
    public abstract getSystemAccessManager(): AccessManager;

    public addUser(user: SystemUser): System {
        this.users.set(user.getUsername(), user);
        return this;
    }

    public getSystemVersion(): number {
        return this.systemVersion;
    }

    public getServer(): AuriaServer {
        return this.server;
    }

    public hasModule(moduleName: string) {
        return this.moduleManager.hasModule(moduleName);
    }

    public addModule(...module: Module[]) {
        module.forEach((mod) => {
            let translations = mod.getTranslations();
            
            for(var lang in translations) {
                if(translations.hasOwnProperty(lang)) {
                    this.translator.addTranslations(lang, translations[lang]);
                }
            }

            this.moduleManager.addModule(mod);
        })
    }

    public getModule(moduleName: string) {
        return this.moduleManager.getModule(moduleName);
    }

    public getAllModules(): Module[] {
        return this.moduleManager.getAllModules();
    }

    /**
     * Alias o getTranslator().translateText()
     * 
     * @param langVar Language + Variation concatenated as a string 
     * @param text 
     */
    public translate(langVar: string, text: string): string {
        let translatedText = this.translator.translateText(langVar, text);
        return translatedText;
    }


    public getUser(username: string) : SystemUser | null {
        if (this.users.has(username)) {
            return this.users.get(username) as SystemUser;
        } else {
            return null;
        }
    }

    public removeUser(username: string) {
        return this.users.delete(username);

    }

    public getConnection(connId : number) {
        
    }

}