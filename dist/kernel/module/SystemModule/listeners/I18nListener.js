"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
class I18nListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "I18nListener");
        this.getTranslations = (req, res) => {
            //let lang: string = (req.requiredParam('lang') as string);
            /*res.addToResponse({
                translations: this.module.getSystem().getTranslator().getTranslations(lang)
            });*/
            res.send();
        };
    }
    getExposedActionsDefinition() {
        return {
            "getTranslations": {
                tables: {}
            }
        };
    }
    getRequiredRequestHandlers() {
        return [];
    }
}
exports.I18nListener = I18nListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSTE4bkxpc3RlbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL2xpc3RlbmVycy9JMThuTGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5REFBaUY7QUFLakYsTUFBYSxZQUFhLFNBQVEsK0JBQWM7SUFJNUMsWUFBWSxNQUFjO1FBQ3RCLEtBQUssQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFlM0Isb0JBQWUsR0FDbEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFFVCwyREFBMkQ7WUFFM0Q7O2lCQUVLO1lBRUwsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDO0lBeEJOLENBQUM7SUFFTSwyQkFBMkI7UUFDOUIsT0FBTztZQUNILGlCQUFpQixFQUFHO2dCQUNoQixNQUFNLEVBQUcsRUFBRzthQUNmO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFFTSwwQkFBMEI7UUFDN0IsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0NBY0o7QUFoQ0Qsb0NBZ0NDIn0=