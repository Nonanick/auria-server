import { AuriaException } from "./AuriaException.js";

export class InvalidParameter extends AuriaException {
    getCode() {
        return "SYS.KERNEL.VALIDATION.INVALID_PARAMETER";
    }
}