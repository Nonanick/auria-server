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
const fs_1 = require("fs");
class Logger {
    constructor(file) {
        this.enableDebug = true;
        this.logFile = file;
    }
    log(...symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            let fString = "[LOG] - " + symbols.join(" ") + "\n";
            return fs_1.promises.appendFile(this.logFile, fString);
        });
    }
    debug(...symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableDebug)
                return;
            let fString = "[DBG] - " + symbols.join(" ") + "\n";
            return fs_1.promises.appendFile(this.logFile, fString);
        });
    }
    error(...symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            let fString = "[ERR] - " + symbols.join(" ") + "\n";
            return fs_1.promises.appendFile(this.logFile, fString);
        });
    }
}
exports.Logger = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9sb2dnZXIvTG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQkFBb0M7QUFFcEMsTUFBYSxNQUFNO0lBTWYsWUFBWSxJQUFZO1FBSmpCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBTXRCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBRXhCLENBQUM7SUFFWSxHQUFHLENBQUMsR0FBRyxPQUFjOztZQUM5QixJQUFJLE9BQU8sR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDcEQsT0FBTyxhQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBRVksS0FBSyxDQUFDLEdBQUcsT0FBYzs7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUNqQixPQUFPO1lBRVgsSUFBSSxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3BELE9BQU8sYUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FBQTtJQUVZLEtBQUssQ0FBQyxHQUFHLE9BQWM7O1lBQ2hDLElBQUksT0FBTyxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNwRCxPQUFPLGFBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxDQUFDO0tBQUE7Q0FFSjtBQTlCRCx3QkE4QkMifQ==