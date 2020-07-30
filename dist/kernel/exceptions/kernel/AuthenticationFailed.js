import { AuriaException } from "../AuriaException.js";
export class AuthenticationFailed extends AuriaException {
    getCode() {
        return "SYS.LOGIN.AUTHENTICATION_FAILED";
    }
}
//# sourceMappingURL=AuthenticationFailed.js.map