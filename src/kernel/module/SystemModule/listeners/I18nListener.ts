import { ModuleListener } from "../../ModuleListener";
import { Module } from "../../Module";
import { ListenerAction } from "../../ListenerAction";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata";

export class I18nListener extends ModuleListener {



    constructor(module: Module) {
        super(module, "I18n");
    }

    public getExposedActionsMetadata(): AuriaListenerActionMetadata {
        return {
            "getTranslations": {
                DISABLE_WHITELIST_RULE: true,
                DISABLE_BLACKLIST_RULE: true,
            },
            "testTranslations": {
                accessRules: [
                    {
                        name: "TestingPermissions",
                        rule: async (context) => {
                            return context.user.getUsername() == "nich";
                        }
                    }
                ]
            }
        };
    }

    public testTranslations: ListenerAction = (req) => {
        return "Congrats you can access this!";
    };

    public getTranslations: ListenerAction =
        (req) => {
            return {
                "translations": []
            };
        };

}