import { AuriaException } from "../../AuriaException.js";

export class TableAlreadyExists extends AuriaException {
    getCode() {
        return "SYS.KERNEL.DATABASE.TABLE_ALREADY_EXISTS";
    }
    
}