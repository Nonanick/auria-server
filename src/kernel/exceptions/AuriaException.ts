export abstract class AuriaException {

    protected errArgs: any[];
    protected message: string;
    protected code: string;

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



}