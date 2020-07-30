import { AuriaException } from "../../../../exceptions/AuriaException.js";
export class LoginAttemptDenied extends AuriaException {
    getCode() {
        return "SYS.LOGIN.ATTEMPT.DENIED";
    }
}
//# sourceMappingURL=LoginAttemptDenied.js.map