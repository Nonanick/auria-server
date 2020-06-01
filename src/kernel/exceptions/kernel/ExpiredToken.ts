import { AuriaException } from "../AuriaException.js";

export class ExpiredToken extends AuriaException {

    getCode(): string {
        return "SYS.LOGIN.INVALID_OR_EXPIRED_TOKEN";
    }

}