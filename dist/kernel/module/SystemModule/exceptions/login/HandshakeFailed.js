import { AuriaException } from "../../../../exceptions/AuriaException.js";
export class HandshakeFailed extends AuriaException {
    getCode() {
        return "000000100";
    }
}
