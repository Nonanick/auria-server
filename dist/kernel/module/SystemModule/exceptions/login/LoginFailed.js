import { AuriaException } from "../../../../exceptions/AuriaException.js";
export class LoginFailed extends AuriaException {
    getCode() {
        return "00000101";
    }
}
