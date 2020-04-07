"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("../Module");
//import { UIListener } from "./listeners/UIListener";
const I18nListener_1 = require("./listeners/I18nListener");
const TableListener_1 = require("./listeners/TableListener");
const LoginListener_1 = require("./listeners/LoginListener");
const DataSyncListener_1 = require("./listeners/DataSyncListener");
const Lang_En_1 = require("./i18n/Lang-En");
const Translator_1 = require("../../i18n/Translator");
const Lang_Pt_1 = require("./i18n/Lang-Pt");
const LoginRequest_1 = require("./requests/LoginRequest");
class SystemModule extends Module_1.Module {
    constructor(system) {
        super(system, "SystemModule");
        this.__translations = {};
        this.loginListener = new LoginListener_1.LoginListener(this);
        this.addListener(
        // Add translations capability
        new I18nListener_1.I18nListener(this), 
        // Add UI interface parameters
        // new UIListener(this),
        // Add Table metadata exposure
        new TableListener_1.TableListener(this), 
        // Add Login functionality to the server!
        this.loginListener, 
        // Add Data Sync functionality
        new DataSyncListener_1.DataSyncListener(this));
    }
    loadTranslations() {
        this.__translations[Translator_1.Languages.English] = Translator_1.Translator.objectToTranslations(Lang_En_1.SystemEnglish);
        this.__translations[Translator_1.Languages.Portuguese] = Translator_1.Translator.objectToTranslations(Lang_Pt_1.SystemPortuguese);
        return this.__translations;
    }
    getTranslations() {
        let translations = this.loadTranslations();
        for (var lang in translations) {
            if (translations.hasOwnProperty(lang)) {
                let t = translations[lang];
                for (var key in t) {
                    let value = t[key];
                    delete t[key];
                    t["Auria.System." + key] = value;
                }
            }
        }
        return translations;
    }
    handleRequest(request, response) {
        // Adds 'setCookie' and 'loginWithPassword' capabilities
        if (request.getRequestStack().listener() == this.loginListener.name
            || request.getRequestStack().listener() + "Listener" == this.loginListener.name)
            request = LoginRequest_1.LoginRequestFactory.make(request, response, this.system);
        return super.handleRequest(request, response);
    }
}
exports.SystemModule = SystemModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL1N5c3RlbU1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1RDtBQUV2RCxzREFBc0Q7QUFDdEQsMkRBQXdEO0FBQ3hELDZEQUEwRDtBQUMxRCw2REFBMEQ7QUFDMUQsbUVBQWdFO0FBQ2hFLDRDQUErQztBQUMvQyxzREFBOEQ7QUFDOUQsNENBQWtEO0FBR2xELDBEQUE4RDtBQUU5RCxNQUFhLFlBQWEsU0FBUSxlQUFNO0lBTXBDLFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBTDFCLG1CQUFjLEdBQXVCLEVBQUUsQ0FBQztRQU81QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsV0FBVztRQUNaLDhCQUE4QjtRQUM5QixJQUFJLDJCQUFZLENBQUMsSUFBSSxDQUFDO1FBRXRCLDhCQUE4QjtRQUMvQix3QkFBd0I7UUFFdkIsOEJBQThCO1FBQzlCLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUM7UUFFdkIseUNBQXlDO1FBQ3pDLElBQUksQ0FBQyxhQUFhO1FBRWxCLDhCQUE4QjtRQUM5QixJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxDQUM3QixDQUFDO0lBRU4sQ0FBQztJQUVNLGdCQUFnQjtRQUVuQixJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsdUJBQVUsQ0FBQyxvQkFBb0IsQ0FBQyx1QkFBYSxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLHVCQUFVLENBQUMsb0JBQW9CLENBQUMsMEJBQWdCLENBQUMsQ0FBQztRQUU5RixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFFL0IsQ0FBQztJQUVNLGVBQWU7UUFDbEIsSUFBSSxZQUFZLEdBQXVCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRS9ELEtBQUssSUFBSSxJQUFJLElBQUksWUFBWSxFQUFFO1lBQzNCLElBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixLQUFLLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtvQkFDZixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNkLENBQUMsQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUNwQzthQUNKO1NBQ0o7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRU0sYUFBYSxDQUFDLE9BQXNCLEVBQUUsUUFBa0I7UUFFM0Qsd0RBQXdEO1FBQ3hELElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSTtlQUM1RCxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSTtZQUMvRSxPQUFPLEdBQUcsa0NBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZFLE9BQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUdKO0FBbEVELG9DQWtFQyJ9