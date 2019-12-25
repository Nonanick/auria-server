import { AuriaException } from "../../../../exceptions/AuriaException";

export class LogoutFailed extends AuriaException {

    getCode() {
        return "00009";
    }
}