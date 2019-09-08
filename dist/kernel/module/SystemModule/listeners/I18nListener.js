"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
class I18nListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "I18nListener");
        this.getTranslations = (req, res) => {
            let lang = req.requiredParam('lang');
            res.addToResponse({
                translations: this.module.getSystem().getTranslator().getTranslations(lang)
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSTE4bkxpc3RlbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL2xpc3RlbmVycy9JMThuTGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5REFBaUY7QUFLakYsTUFBYSxZQUFhLFNBQVEsK0JBQWM7SUFJNUMsWUFBWSxNQUFjO1FBQ3RCLEtBQUssQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFlM0Isb0JBQWUsR0FDbEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFFVCxJQUFJLElBQUksR0FBWSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBWSxDQUFDO1lBRXpELEdBQUcsQ0FBQyxhQUFhLENBQUM7Z0JBQ2QsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQzthQUM5RSxDQUFDLENBQUM7WUFFSCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUM7SUF4Qk4sQ0FBQztJQUVNLDJCQUEyQjtRQUM5QixPQUFPO1lBQ0gsaUJBQWlCLEVBQUc7Z0JBQ2hCLE1BQU0sRUFBRyxFQUFHO2FBQ2Y7U0FDSixDQUFDO0lBQ04sQ0FBQztJQUVNLDBCQUEwQjtRQUM3QixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FjSjtBQWhDRCxvQ0FnQ0MifQ==