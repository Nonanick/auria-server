import { AuriaException } from "../../../../exceptions/AuriaException.js";


export class HandshakeFailed extends AuriaException {

    getCode(): string {
        return "000000100";
    }

}