"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = require("../../../../kernel/module/Module");
const ConnectionListener_1 = require("./listener/ConnectionListener");
const TableManagerListener_1 = require("./listener/TableManagerListener");
const Lang_En_1 = require("./i18n/Lang-En");
const Translator_1 = require("../../../../kernel/i18n/Translator");
class AuriaArchitect extends Module_1.Module {
    constructor(system) {
        super(system, "auria.architect");
        this.addListener(new ConnectionListener_1.ConnectionListener(this, "ConnectionListener"), new TableManagerListener_1.TableManagerListener(this));
    }
    loadTranslations() {
        let translations = {};
        translations[Translator_1.Languages.English] = Translator_1.Translator.objectToTranslations(Lang_En_1.ArchitectEnglish);
        return translations;
    }
}
exports.AuriaArchitect = AuriaArchitect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFBcmNoaXRlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L0F1cmlhQXJjaGl0ZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQThFO0FBRTlFLHNFQUFtRTtBQUNuRSwwRUFBdUU7QUFDdkUsNENBQWtEO0FBQ2xELG1FQUEyRTtBQUUzRSxNQUFhLGNBQWUsU0FBUSxlQUFNO0lBRXRDLFlBQVksTUFBZTtRQUV2QixLQUFLLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLFdBQVcsQ0FDWixJQUFJLHVDQUFrQixDQUFDLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxFQUNsRCxJQUFJLDJDQUFvQixDQUFDLElBQUksQ0FBQyxDQUNqQyxDQUFDO0lBRU4sQ0FBQztJQUVNLGdCQUFnQjtRQUNuQixJQUFJLFlBQVksR0FBd0IsRUFBRSxDQUFDO1FBRTNDLFlBQVksQ0FBQyxzQkFBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLHVCQUFVLENBQUMsb0JBQW9CLENBQUMsMEJBQWdCLENBQUMsQ0FBQztRQUVwRixPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0NBR0o7QUF0QkQsd0NBc0JDIn0=