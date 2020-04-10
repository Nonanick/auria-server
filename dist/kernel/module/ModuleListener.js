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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL21vZHVsZS9Nb2R1bGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1DQUFzQztBQUV0Qyw4RkFBMkY7QUFLM0YsTUFBc0IsY0FBZSxTQUFRLHFCQUFZO0lBa0JyRCxZQUFZLE1BQWMsRUFBRSxJQUFZO1FBQ3BDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQWNEOzs7Ozs7OztPQVFHO0lBQ0ksSUFBSSxDQUFDLEtBQW9DLEVBQUUsR0FBRyxJQUFXO1FBQzVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ1UsYUFBYSxDQUFDLE9BQXdCOztZQUUvQyxJQUFJLGVBQWUsR0FBVyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFakUsSUFBSSxpQkFBaUIsR0FBNEIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFFbEYsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDcEQsTUFBTSxJQUFJLHFEQUF5QixDQUFDLHdFQUF3RSxDQUFDLENBQUM7YUFDakg7WUFFRCxJQUFJLFFBQVEsR0FBb0IsSUFBWSxDQUFDLGVBQWUsQ0FBbUIsQ0FBQztZQUVoRixJQUFHLFFBQVEsSUFBSSxJQUFJLEVBQUU7Z0JBRWpCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNExBQTRMLENBQUMsQ0FBQztnQkFFNU0sTUFBTSxJQUFJLHFEQUF5QixDQUFDLHdFQUF3RSxDQUFDLENBQUM7YUFDakg7WUFFRCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QixDQUFDO0tBQUE7SUFFTSxhQUFhO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBQztDQUVKO0FBckZELHdDQXFGQyJ9