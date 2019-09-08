export declare abstract class AuriaException {
    protected errArgs: any[];
    protected message: string;
    protected code: string;
    constructor(message: string, ...args: any[]);
    getMessage(): string;
    abstract getCode(): string;
    setCode(code: string): this;
    throwError(): void;
}
