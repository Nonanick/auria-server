"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("../Module");
const UIListener_1 = require("./listeners/UIListener");
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
        new UIListener_1.UIListener(this), 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL1N5c3RlbU1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1RDtBQUV2RCx1REFBb0Q7QUFDcEQsMkRBQXdEO0FBQ3hELDZEQUEwRDtBQUMxRCw2REFBMEQ7QUFDMUQsbUVBQWdFO0FBQ2hFLDRDQUErQztBQUMvQyxzREFBOEQ7QUFDOUQsNENBQWtEO0FBSWxELDBEQUE4RDtBQUU5RCxNQUFhLFlBQWEsU0FBUSxlQUFNO0lBTXBDLFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBTDFCLG1CQUFjLEdBQXVCLEVBQUUsQ0FBQztRQU81QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsV0FBVztRQUNaLDhCQUE4QjtRQUM5QixJQUFJLDJCQUFZLENBQUMsSUFBSSxDQUFDO1FBRXRCLDhCQUE4QjtRQUM5QixJQUFJLHVCQUFVLENBQUMsSUFBSSxDQUFDO1FBRXBCLDhCQUE4QjtRQUM5QixJQUFJLDZCQUFhLENBQUMsSUFBSSxDQUFDO1FBRXZCLHlDQUF5QztRQUN6QyxJQUFJLENBQUMsYUFBYTtRQUVsQiw4QkFBOEI7UUFDOUIsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FDN0IsQ0FBQztJQUVOLENBQUM7SUFFTSxnQkFBZ0I7UUFFbkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLHVCQUFVLENBQUMsb0JBQW9CLENBQUMsdUJBQWEsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyx1QkFBVSxDQUFDLG9CQUFvQixDQUFDLDBCQUFnQixDQUFDLENBQUM7UUFFOUYsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBRS9CLENBQUM7SUFFTSxlQUFlO1FBQ2xCLElBQUksWUFBWSxHQUF1QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUUvRCxLQUFLLElBQUksSUFBSSxJQUFJLFlBQVksRUFBRTtZQUMzQixJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZCxDQUFDLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDcEM7YUFDSjtTQUNKO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVNLGFBQWEsQ0FBQyxPQUFzQixFQUFFLFFBQWtCO1FBRTNELHdEQUF3RDtRQUN4RCxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUk7ZUFDNUQsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUk7WUFDL0UsT0FBTyxHQUFHLGtDQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RSxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FHSjtBQWxFRCxvQ0FrRUMifQ==