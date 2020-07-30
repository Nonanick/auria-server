import { AuriaException } from "../../AuriaException.js";

export class ModuleManagerAlreadyBooted extends AuriaException {
    getCode() {
        return "SYS.KERNEL.MODULE_MANAGER.ALREADY_BOOTED";
    }
}