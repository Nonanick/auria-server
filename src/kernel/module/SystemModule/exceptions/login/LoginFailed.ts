import { AuriaException } from "../../../../exceptions/AuriaException.js";


export class LoginFailed extends AuriaException {

    getCode(): string {
        return "00000101";
    }

}