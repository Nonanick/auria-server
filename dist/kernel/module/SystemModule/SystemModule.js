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
class SystemModule extends Module_1.Module {
    constructor(system) {
        super(system, "SystemModule");
        this.__translations = {};
        this.addListener(
        // Add translations capability
        new I18nListener_1.I18nListener(this), 
        // Add UI interface parameters
        new UIListener_1.UIListener(this), 
        // Add Table metadata exposure
        new TableListener_1.TableListener(this), 
        // Add Login functionality to the server!
        new LoginListener_1.LoginListener(this), 
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
}
exports.SystemModule = SystemModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtTW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL1N5c3RlbU1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1RDtBQUV2RCx1REFBb0Q7QUFDcEQsMkRBQXdEO0FBQ3hELDZEQUEwRDtBQUMxRCw2REFBMEQ7QUFDMUQsbUVBQWdFO0FBQ2hFLDRDQUErQztBQUMvQyxzREFBOEQ7QUFDOUQsNENBQWtEO0FBSWxELE1BQWEsWUFBYSxTQUFRLGVBQU07SUFJcEMsWUFBWSxNQUFjO1FBQ3RCLEtBQUssQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFIMUIsbUJBQWMsR0FBdUIsRUFBRSxDQUFDO1FBSzVDLElBQUksQ0FBQyxXQUFXO1FBQ1osOEJBQThCO1FBQzlCLElBQUksMkJBQVksQ0FBQyxJQUFJLENBQUM7UUFDdEIsOEJBQThCO1FBQzlCLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUM7UUFDcEIsOEJBQThCO1FBQzlCLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUM7UUFDdkIseUNBQXlDO1FBQ3pDLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUM7UUFDdkIsOEJBQThCO1FBQzlCLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLENBQzdCLENBQUM7SUFFTixDQUFDO0lBRU0sZ0JBQWdCO1FBRW5CLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyx1QkFBVSxDQUFDLG9CQUFvQixDQUFDLHVCQUFhLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsdUJBQVUsQ0FBQyxvQkFBb0IsQ0FBQywwQkFBZ0IsQ0FBQyxDQUFDO1FBRTlGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUUvQixDQUFDO0lBRU0sZUFBZTtRQUNsQixJQUFJLFlBQVksR0FBdUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFL0QsS0FBSyxJQUFJLElBQUksSUFBSSxZQUFZLEVBQUU7WUFDM0IsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO29CQUNmLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2QsQ0FBQyxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3BDO2FBQ0o7U0FDSjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FHSjtBQWhERCxvQ0FnREMifQ==