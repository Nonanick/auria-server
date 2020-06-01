import { AuriaException } from "../AuriaException.js";

export class AuthenticationFailed extends AuriaException {
    getCode(): string {
        return "SYS.LOGIN.AUTHENTICATION_FAILED";
    }

}