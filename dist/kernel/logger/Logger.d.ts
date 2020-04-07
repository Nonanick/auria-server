export declare class Logger {
    enableDebug: boolean;
    private logFile;
    constructor(file: string);
    log(...symbols: any[]): Promise<void>;
    debug(...symbols: any[]): Promise<void>;
    error(...symbols: any[]): Promise<void>;
}
