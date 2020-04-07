"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuriaException {
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
exports.AuriaException = AuriaException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFFeGNlcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL2V4Y2VwdGlvbnMvQXVyaWFFeGNlcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFzQixjQUFjO0lBT2hDLFlBQVksT0FBZSxFQUFFLEdBQUcsSUFBVztRQURqQyxhQUFRLEdBQVcsR0FBRyxDQUFDO1FBRTdCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxVQUFVO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFJTSxPQUFPLENBQUMsSUFBWTtRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sVUFBVTtRQUNiLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5SCxDQUFDO0lBRU0sbUJBQW1CLENBQUMsSUFBWTtRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sV0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRU0sWUFBWTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0NBS0o7QUE1Q0Qsd0NBNENDIn0=