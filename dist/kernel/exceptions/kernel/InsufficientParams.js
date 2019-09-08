"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaException_1 = require("../AuriaException");
class InsufficientParams extends AuriaException_1.AuriaException {
    constructor(message, requiredParams) {
        super(message, requiredParams);
    }
    getCode() {
        return InsufficientParams.InsufficientParamsCode;
    }
}
InsufficientParams.InsufficientParamsCode = "AE_INS_PARAM";
exports.InsufficientParams = InsufficientParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zdWZmaWNpZW50UGFyYW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9leGNlcHRpb25zL2tlcm5lbC9JbnN1ZmZpY2llbnRQYXJhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBbUQ7QUFFbkQsTUFBYSxrQkFBbUIsU0FBUSwrQkFBYztJQUlsRCxZQUFZLE9BQWUsRUFBRSxjQUF3QjtRQUNqRCxLQUFLLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPO1FBQ0gsT0FBTyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQztJQUNyRCxDQUFDOztBQVJhLHlDQUFzQixHQUFXLGNBQWMsQ0FBQztBQUZsRSxnREFhQyJ9