export declare abstract class AuriaException {
    protected errArgs: any[];
    protected message: string;
    protected code: string;
    protected httpCode: number;
    constructor(message: string, ...args: any[]);
    getMessage(): string;
    abstract getCode(): string;
    setCode(code: string): this;
    throwError(): void;
    setHttpResponseCode(code: number): this;
    getHttpCode(): number;
    getExtraArgs(): any[];
}
