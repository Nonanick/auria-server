import { promises as fs } from 'fs';

export class Logger {

    public enableDebug = true;

    private logFile: string;

    constructor(file: string) {

        this.logFile = file;

    }

    public async log(...symbols: any[]) {
        let fString = "[LOG] - " + symbols.join(" ") + "\n";
        return fs.appendFile(this.logFile, fString);
    }

    public async debug(...symbols: any[]) {
        if (!this.enableDebug)
            return;
            
        let fString = "[DBG] - " + symbols.join(" ") + "\n";
        return fs.appendFile(this.logFile, fString);
    }

    public async error(...symbols: any[]) {
        let fString = "[ERR] - " + symbols.join(" ") + "\n";
        return fs.appendFile(this.logFile, fString);
    }

}