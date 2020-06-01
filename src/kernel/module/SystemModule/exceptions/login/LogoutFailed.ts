import { AuriaException } from "../../../../exceptions/AuriaException.js";


export class LogoutFailed extends AuriaException {

    getCode() {
        return "00009";
    }
}