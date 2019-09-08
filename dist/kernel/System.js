"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaServer_1 = require("../AuriaServer");
const SystemModule_1 = require("./module/SystemModule/SystemModule");
const ModuleManager_1 = require("./module/ModuleManager");
const AuthModule_1 = require("./module/AuthModule/AuthModule");
const Translator_1 = require("./i18n/Translator");
const DataAccessManager_1 = require("./security/data/DataAccessManager");
const Table_1 = require("./database/structure/table/Table");
const DataTypeRepository_1 = require("./database/structure/dataType/DataTypeRepository");
exports.DEFAULT_LANG = "en";
exports.DEFAULT_LANG_VARIATION = "us";
class System {
    constructor(server, name) {
        /**
         * Translations
         *
         * Hold all the loaded translations from this server
         */
        this.loadedTranslations = {};
        this.name = name;
        this.server = server;
        console.log("[System] Creating new system: ", name);
        this.connection = this.buildSystemConnection();
        this.translator = new Translator_1.Translator(this);
        this.dataAccessTable = new Table_1.Table(this, "Auria.DataPermission");
        this.dataAccess = new DataAccessManager_1.DataAccessManager(this, this.dataAccessTable);
        this.moduleManager = new ModuleManager_1.ModuleManager(this);
        // If ENV == "development", sstemversion does not change!
        if (AuriaServer_1.Auria_ENV == "development")
            this.systemVersion = 1;
        else
            this.systemVersion = Math.round(Math.random() * 1000000);
        this.users = new Map();
        console.log("[System] Initializing modules from system ", name);
        this.addModule(
        // # - Authentication Module
        new AuthModule_1.AuthModule(this), 
        // # - System related functions Module
        new SystemModule_1.SystemModule(this));
    }
    getDataAccessTable() {
        return this.dataAccessTable;
    }
    getDataType(name) {
        return DataTypeRepository_1.DataTypeRepository[name];
    }
    /**
     * Get the system translator
     *
     */
    getTranslator() {
        return this.translator;
    }
    addUser(user) {
        this.users.set(user.getUsername(), user);
        return this;
    }
    getSystemVersion() {
        return this.systemVersion;
    }
    getServer() {
        return this.server;
    }
    hasModule(moduleName) {
        return this.moduleManager.hasModule(moduleName);
    }
    addModule(...module) {
        module.forEach((mod) => {
            let translations = mod.getTranslations();
            for (var lang in translations) {
                if (translations.hasOwnProperty(lang)) {
                    this.translator.addTranslations(lang, translations[lang]);
                }
            }
            this.moduleManager.addModule(mod);
        });
    }
    getModule(moduleName) {
        return this.moduleManager.getModule(moduleName);
    }
    getAllModules() {
        return this.moduleManager.getAllModules();
    }
    /**
     * Alias o getTranslator().translateText()
     *
     * @param langVar Language + Variation concatenated as a string
     * @param text
     */
    translate(langVar, text) {
        let translatedText = this.translator.translateText(langVar, text);
        return translatedText;
    }
    getUser(username) {
        if (this.users.has(username)) {
            return this.users.get(username);
        }
        else {
            return null;
        }
    }
    removeUser(username) {
        return this.users.delete(username);
    }
    getData() {
        return this.dataAccess;
    }
    getConnection(connId) {
    }
}
exports.System = System;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9TeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxnREFBd0Q7QUFDeEQscUVBQWtFO0FBQ2xFLDBEQUF1RDtBQUV2RCwrREFBNEQ7QUFDNUQsa0RBQStDO0FBQy9DLHlFQUFzRTtBQUN0RSw0REFBeUQ7QUFHekQseUZBQXNGO0FBRXpFLFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFBLHNCQUFzQixHQUFHLElBQUksQ0FBQztBQUczQyxNQUFzQixNQUFNO0lBNkV4QixZQUFZLE1BQW1CLEVBQUUsSUFBWTtRQVQ3Qzs7OztXQUlHO1FBQ08sdUJBQWtCLEdBRXhCLEVBQUUsQ0FBQztRQUdILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUUvQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksYUFBSyxDQUFDLElBQUksRUFBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXBFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw2QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdDLHlEQUF5RDtRQUN6RCxJQUFHLHVCQUFTLElBQUksYUFBYTtZQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7WUFFdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFJdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsU0FBUztRQUNWLDRCQUE0QjtRQUM1QixJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDO1FBRXBCLHNDQUFzQztRQUN0QyxJQUFJLDJCQUFZLENBQUMsSUFBSSxDQUFDLENBQ3pCLENBQUM7SUFDTixDQUFDO0lBRU0sa0JBQWtCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUNoQyxDQUFDO0lBRU0sV0FBVyxDQUFDLElBQWE7UUFDNUIsT0FBTyx1Q0FBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksYUFBYTtRQUNoQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQThCTSxPQUFPLENBQUMsSUFBZ0I7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxTQUFTLENBQUMsVUFBa0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sU0FBUyxDQUFDLEdBQUcsTUFBZ0I7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ25CLElBQUksWUFBWSxHQUFHLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV6QyxLQUFJLElBQUksSUFBSSxJQUFJLFlBQVksRUFBRTtnQkFDMUIsSUFBRyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQzdEO2FBQ0o7WUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFTSxTQUFTLENBQUMsVUFBa0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sYUFBYTtRQUNoQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksU0FBUyxDQUFDLE9BQWUsRUFBRSxJQUFZO1FBQzFDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRSxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDO0lBR00sT0FBTyxDQUFDLFFBQWdCO1FBQzNCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQWUsQ0FBQztTQUNqRDthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFTSxVQUFVLENBQUMsUUFBZ0I7UUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV2QyxDQUFDO0lBRU0sT0FBTztRQUNWLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sYUFBYSxDQUFDLE1BQWU7SUFFcEMsQ0FBQztDQUVKO0FBck9ELHdCQXFPQyJ9