import { AuriaException } from "../../AuriaException.js";

export class ConnectionNotFound extends AuriaException {
    getCode() {
        return "SYS.KERNEL.CONNECTION.CONNECTION_NOT_FOUND";
    }
}