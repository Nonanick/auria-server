export abstract class AuriaException {

    protected errArgs: any[];
    protected message: string;
    protected code: string;

    protected httpCode: number = 400;
    
    constructor(message: string, ...args: any[]) {
        this.message = message;
        this.errArgs = args;
    }

    public getMessage(): string {
        return this.message;
    }

    abstract getCode(): string;

    public setCode(code: string) {
        this.code = code;
        return this;
    }

    public throwError() {
        let now = new Date();
        throw new Error("\n[" + now.toLocaleDateString() + "]: EXCEPTION '" + this.getCode() + "':\n-- Message\n" + this.message);
    }

    public setHttpResponseCode(code: number) {
        this.httpCode = code;
        return this;
    }

    public getHttpCode(): number {
        return this.httpCode;
    }

    public getExtraArgs() : any[] {
        return this.errArgs;
    }




}