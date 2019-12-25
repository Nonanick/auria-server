import { AuriaException } from "../../../../exceptions/AuriaException";

export class HandshakeFailed extends AuriaException {

    getCode(): string {
        return "000000100";
    }

}