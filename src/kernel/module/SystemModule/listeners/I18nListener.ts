import { ModuleListener, ListenerActionsDefinition } from "../../ModuleListener";
import { AuriaRequest } from "../../../http/AuriaRequest";
import { AuriaResponse } from "../../../http/AuriaResponse";
import { Module } from "../../Module";

export class I18nListener extends ModuleListener {
  


    constructor(module: Module) {
        super(module, "I18nListener");
    }

    public getExposedActionsDefinition(): ListenerActionsDefinition {
        return {
            "getTranslations" : {
                tables : { }
            }
        };
    }

    public getRequiredRequestHandlers(): import("../../../http/AuriaMiddleware").AuriaMiddleware[] {
        return [];
    }

    public getTranslations: (req: AuriaRequest, res: AuriaResponse) => void =
        (req, res) => {

            //let lang: string = (req.requiredParam('lang') as string);

            /*res.addToResponse({
                translations: this.module.getSystem().getTranslator().getTranslations(lang)
            });*/

            res.send();
        };

}