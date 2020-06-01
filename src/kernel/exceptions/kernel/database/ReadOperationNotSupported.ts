import { AuriaException } from "../../AuriaException.js";

export class ReadOperationNotSupported extends AuriaException {
    getCode() {
        return "SYS.KERNEL.DATA_STEWARD.READ_OPERATION_NOT_SUPPORTED";
    }
}