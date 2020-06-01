export class AuriaException {
    constructor(message, ...args) {
        this.httpCode = 400;
        this.message = message;
        this.errArgs = args;
    }
    getMessage() {
        return this.message;
    }
    setCode(code) {
        this.code = code;
        return this;
    }
    throwError() {
        let now = new Date();
        throw new Error("\n[" + now.toLocaleDateString() + "]: EXCEPTION '" + this.getCode() + "':\n-- Message\n" + this.message);
    }
    setHttpResponseCode(code) {
        this.httpCode = code;
        return this;
    }
    getHttpCode() {
        return this.httpCode;
    }
    getExtraArgs() {
        return this.errArgs;
    }
}
