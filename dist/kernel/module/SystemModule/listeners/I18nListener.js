"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
class I18nListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "I18n");
        this.testTranslations = (req) => {
            return "Congrats you can access this!";
        };
        this.getTranslations = (req) => {
            return {
                "translations": []
            };
        };
    }
    getExposedActionsMetadata() {
        return {
            "getTranslations": {
                DISABLE_WHITELIST_RULE: true,
                DISABLE_BLACKLIST_RULE: true,
            },
            "testTranslations": {
                accessRules: [
                    {
                        name: "TestingPermissions",
                        rule: (context) => __awaiter(this, void 0, void 0, function* () {
                            return context.user.getUsername() == "nich";
                        })
                    }
                ]
            }
        };
    }
}
exports.I18nListener = I18nListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSTE4bkxpc3RlbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL2xpc3RlbmVycy9JMThuTGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx5REFBc0Q7QUFLdEQsTUFBYSxZQUFhLFNBQVEsK0JBQWM7SUFJNUMsWUFBWSxNQUFjO1FBQ3RCLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFzQm5CLHFCQUFnQixHQUFtQixDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzlDLE9BQU8sK0JBQStCLENBQUM7UUFDM0MsQ0FBQyxDQUFDO1FBRUssb0JBQWUsR0FDbEIsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNKLE9BQU87Z0JBQ0gsY0FBYyxFQUFFLEVBQUU7YUFDckIsQ0FBQztRQUNOLENBQUMsQ0FBQztJQTlCTixDQUFDO0lBRU0seUJBQXlCO1FBQzVCLE9BQU87WUFDSCxpQkFBaUIsRUFBRTtnQkFDZixzQkFBc0IsRUFBRSxJQUFJO2dCQUM1QixzQkFBc0IsRUFBRSxJQUFJO2FBQy9CO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLFdBQVcsRUFBRTtvQkFDVDt3QkFDSSxJQUFJLEVBQUUsb0JBQW9CO3dCQUMxQixJQUFJLEVBQUUsQ0FBTyxPQUFPLEVBQUUsRUFBRTs0QkFDcEIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLE1BQU0sQ0FBQzt3QkFDaEQsQ0FBQyxDQUFBO3FCQUNKO2lCQUNKO2FBQ0o7U0FDSixDQUFDO0lBQ04sQ0FBQztDQWFKO0FBdENELG9DQXNDQyJ9