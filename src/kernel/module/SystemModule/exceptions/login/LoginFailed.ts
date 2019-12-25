import { AuriaException } from "../../../../exceptions/AuriaException";

export class LoginFailed extends AuriaException {

    getCode(): string {
        return "00000101";
    }

}