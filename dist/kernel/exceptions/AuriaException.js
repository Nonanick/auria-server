"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuriaException {
    constructor(message, ...args) {
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
}
exports.AuriaException = AuriaException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFFeGNlcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL2V4Y2VwdGlvbnMvQXVyaWFFeGNlcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFzQixjQUFjO0lBTWhDLFlBQVksT0FBZSxFQUFFLEdBQUcsSUFBVztRQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRU0sVUFBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBSU0sT0FBTyxDQUFDLElBQVk7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLFVBQVU7UUFDYixJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUgsQ0FBQztDQUlKO0FBN0JELHdDQTZCQyJ9