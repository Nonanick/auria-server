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
    emit(event, ...args) {
        return super.emit(event, args);
    }
    whenActionFinished(fn) {
        let onlyOnceHandler = () => {
            fn();
            this.removeListener("actionFinished", onlyOnceHandler);
        };
        this.addListener("actionFinished", onlyOnceHandler);
    }
    done() {
        this.emit("actionFinished");
    }
    setTables(tables) {
        this.tables = tables;
        return this;
    }
    handleRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestedAction = request.getRequestStack().action();
            let actionsDefinition = this.getExposedActionsDefinition();
            if (!actionsDefinition.hasOwnProperty(requestedAction)) {
                throw new ListenerActionUnavaliable_1.ListenerActionUnavaliable("The requested action in the listener does not exist or is not exposed!");
            }
            let actionFn = this[requestedAction];
            return actionFn(request);
        });
    }
}
exports.ModuleListener = ModuleListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL21vZHVsZS9Nb2R1bGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsbUNBQXNDO0FBR3RDLDhGQUEyRjtBQWtCM0YsTUFBc0IsY0FBZSxTQUFRLHFCQUFZO0lBUXJELFlBQVksTUFBYyxFQUFFLElBQVk7UUFDcEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBTU0sSUFBSSxDQUFDLEtBQTJCLEVBQUUsR0FBRyxJQUFXO1FBQ25ELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVNLGtCQUFrQixDQUFDLEVBQWM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsR0FBRyxFQUFFO1lBQ3ZCLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRXhELENBQUM7SUFFTSxJQUFJO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxTQUFTLENBQUMsTUFBMEI7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVZLGFBQWEsQ0FBQyxPQUF3Qjs7WUFFL0MsSUFBSSxlQUFlLEdBQVcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWpFLElBQUksaUJBQWlCLEdBQThCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBRXRGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ3BELE1BQU0sSUFBSSxxREFBeUIsQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO2FBQ2pIO1lBRUQsSUFBSSxRQUFRLEdBQXFCLElBQVksQ0FBQyxlQUFlLENBQW1CLENBQUM7WUFFakYsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0IsQ0FBQztLQUFBO0NBRUo7QUF6REQsd0NBeURDIn0=