"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSTE4bkxpc3RlbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2R1bGUvU3lzdGVtTW9kdWxlL2xpc3RlbmVycy9JMThuTGlzdGVuZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlEQUFzRDtBQUt0RCxNQUFhLFlBQWEsU0FBUSwrQkFBYztJQUk1QyxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQXNCbkIscUJBQWdCLEdBQW1CLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDOUMsT0FBTywrQkFBK0IsQ0FBQztRQUMzQyxDQUFDLENBQUM7UUFFSyxvQkFBZSxHQUNsQixDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ0osT0FBTztnQkFDSCxjQUFjLEVBQUUsRUFBRTthQUNyQixDQUFDO1FBQ04sQ0FBQyxDQUFDO0lBOUJOLENBQUM7SUFFTSx5QkFBeUI7UUFDNUIsT0FBTztZQUNILGlCQUFpQixFQUFFO2dCQUNmLHNCQUFzQixFQUFFLElBQUk7Z0JBQzVCLHNCQUFzQixFQUFFLElBQUk7YUFDL0I7WUFDRCxrQkFBa0IsRUFBRTtnQkFDaEIsV0FBVyxFQUFFO29CQUNUO3dCQUNJLElBQUksRUFBRSxvQkFBb0I7d0JBQzFCLElBQUksRUFBRSxDQUFPLE9BQU8sRUFBRSxFQUFFOzRCQUNwQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksTUFBTSxDQUFDO3dCQUNoRCxDQUFDLENBQUE7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKLENBQUM7SUFDTixDQUFDO0NBYUo7QUF0Q0Qsb0NBc0NDIn0=