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
const events_1 = require("events");
const ListenerActionUnavaliable_1 = require("../exceptions/kernel/ListenerActionUnavaliable");
class ModuleListener extends events_1.EventEmitter {
    constructor(module, name) {
        super();
        this.module = module;
        this.name = name;
    }
    /**
     * Emit
     * ------
     * Typescript facility, exposes all ModuleListenerEvents as the first parameter
     * @override
     *
     * @param event
     * @param args
     */
    emit(event, ...args) {
        return super.emit(event, args);
    }
    /**
     * Handle Request
     * --------------
     *
     * Last part of the Express 'Request' object life cycle
     * inside Auria!
     * Should call the desired action
     * @param request
     */
    handleRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestedAction = request.getRequestStack().action();
            let actionsDefinition = this.getExposedActionsMetadata();
            if (!actionsDefinition.hasOwnProperty(requestedAction)) {
                throw new ListenerActionUnavaliable_1.ListenerActionUnavaliable("The requested action in the listener does not exist or is not exposed!");
            }
            let actionFn = this[requestedAction];
            if (actionFn == null) {
                console.error("[ModuleListener] The required action is not a function in this ModuleListener even tough it has been exposed!\nCheck the spelling, the action name and function name should match exactly!");
                throw new ListenerActionUnavaliable_1.ListenerActionUnavaliable("The requested action in the listener does not exist or is not exposed!");
            }
            return actionFn(request);
        });
    }
    getModuleName() {
        return this.module.name;
    }
}
exports.ModuleListener = ModuleListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL21vZHVsZS9Nb2R1bGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsbUNBQXNDO0FBRXRDLDhGQUEyRjtBQUszRixNQUFzQixjQUFlLFNBQVEscUJBQVk7SUFrQnJELFlBQVksTUFBYyxFQUFFLElBQVk7UUFDcEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBY0Q7Ozs7Ozs7O09BUUc7SUFDSSxJQUFJLENBQUMsS0FBb0MsRUFBRSxHQUFHLElBQVc7UUFDNUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDVSxhQUFhLENBQUMsT0FBd0I7O1lBRS9DLElBQUksZUFBZSxHQUFXLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVqRSxJQUFJLGlCQUFpQixHQUE0QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUVsRixJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUNwRCxNQUFNLElBQUkscURBQXlCLENBQUMsd0VBQXdFLENBQUMsQ0FBQzthQUNqSDtZQUVELElBQUksUUFBUSxHQUFvQixJQUFZLENBQUMsZUFBZSxDQUFtQixDQUFDO1lBRWhGLElBQUcsUUFBUSxJQUFJLElBQUksRUFBRTtnQkFFakIsT0FBTyxDQUFDLEtBQUssQ0FBQyw0TEFBNEwsQ0FBQyxDQUFDO2dCQUU1TSxNQUFNLElBQUkscURBQXlCLENBQUMsd0VBQXdFLENBQUMsQ0FBQzthQUNqSDtZQUVELE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTdCLENBQUM7S0FBQTtJQUVNLGFBQWE7UUFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDO0NBRUo7QUFyRkQsd0NBcUZDIn0=