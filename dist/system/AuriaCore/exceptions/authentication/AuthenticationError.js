"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaException_1 = require("../../../../kernel/exceptions/AuriaException");
class AuthenticationError extends AuriaException_1.AuriaException {
    getCode() {
        return "CORESYS.AUTH.FAILED";
    }
}
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aGVudGljYXRpb25FcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9zeXN0ZW0vQXVyaWFDb3JlL2V4Y2VwdGlvbnMvYXV0aGVudGljYXRpb24vQXV0aGVudGljYXRpb25FcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlGQUE4RTtBQUU5RSxNQUFhLG1CQUFvQixTQUFRLCtCQUFjO0lBRW5ELE9BQU87UUFDSCxPQUFPLHFCQUFxQixDQUFDO0lBQ2pDLENBQUM7Q0FFSjtBQU5ELGtEQU1DIn0=