"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaException_1 = require("../AuriaException");
class SystemUnavaliable extends AuriaException_1.AuriaException {
    constructor(message) {
        super("[System] Resource not found!\n" + message);
    }
    getCode() {
        return SystemUnavaliable.CODE;
    }
}
SystemUnavaliable.CODE = "100001";
exports.SystemUnavaliable = SystemUnavaliable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtVW5hdmFsaWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL2V4Y2VwdGlvbnMva2VybmVsL1N5c3RlbVVuYXZhbGlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0RBQW1EO0FBRW5ELE1BQWEsaUJBQWtCLFNBQVEsK0JBQWM7SUFZakQsWUFBWSxPQUFlO1FBQ3ZCLEtBQUssQ0FBQyxnQ0FBZ0MsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBVkQsT0FBTztRQUNILE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDO0lBQ2xDLENBQUM7O0FBSmEsc0JBQUksR0FBRyxRQUFRLENBQUM7QUFGbEMsOENBZUMifQ==