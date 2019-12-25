import { AuriaException } from "./AuriaException";

export class ParameterAlreadyInitialized extends AuriaException {

    getCode() {
        return "SYS.KERNEL.PARAMETER_ALREADY_INITIALIZED";
    }

}