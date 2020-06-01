import { Module } from "../../Module.js";import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { ModuleListener } from "../../api/ModuleListener.js";
import { ListenerAction } from "../../api/ListenerAction.js";

export class I18nListener extends ModuleListener {


    constructor(module: Module) {
        super(module, "I18n");
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
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