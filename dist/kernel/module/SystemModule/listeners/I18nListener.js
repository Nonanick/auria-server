var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModuleListener } from "../../api/ModuleListener.js";
export class I18nListener extends ModuleListener {
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
    getMetadataFromExposedActions() {
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
//# sourceMappingURL=I18nListener.js.map