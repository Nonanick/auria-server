"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
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
}
exports.ModuleListener = ModuleListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL21vZHVsZS9Nb2R1bGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLG1DQUFzQztBQWtCdEMsTUFBc0IsY0FBZSxTQUFRLHFCQUFZO0lBU3JELFlBQVksTUFBZSxFQUFFLElBQWE7UUFDdEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBTU0sSUFBSSxDQUFDLEtBQTRCLEVBQUUsR0FBRyxJQUFZO1FBQ3JELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVNLGtCQUFrQixDQUFFLEVBQWU7UUFDdEMsSUFBSSxlQUFlLEdBQUcsR0FBRyxFQUFFO1lBQ3ZCLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRyxlQUFlLENBQUUsQ0FBQztRQUM3RCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRXhELENBQUM7SUFFTSxJQUFJO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxTQUFTLENBQUMsTUFBMkI7UUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUVKO0FBMUNELHdDQTBDQyJ9