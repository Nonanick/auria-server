var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs } from 'fs';
export class Logger {
    constructor(file) {
        this.enableDebug = true;
        this.logFile = file;
    }
    log(...symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            let fString = "[LOG] - " + symbols.join(" ") + "\n";
            return fs.appendFile(this.logFile, fString);
        });
    }
    debug(...symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableDebug)
                return;
            let fString = "[DBG] - " + symbols.join(" ") + "\n";
            return fs.appendFile(this.logFile, fString);
        });
    }
    error(...symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            let fString = "[ERR] - " + symbols.join(" ") + "\n";
            return fs.appendFile(this.logFile, fString);
        });
    }
}
