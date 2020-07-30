import { AuriaException } from "../../AuriaException.js"

export class ModuleRowDataMissing extends AuriaException {

    getCode(): string {
        return "SYS.KERNEL.MODULE.ROW_DATA_MISSING";
    }
}