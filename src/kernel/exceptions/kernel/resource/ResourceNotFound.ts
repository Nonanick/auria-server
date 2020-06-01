import { AuriaException } from "../../AuriaException.js";

export class ResourceNotFound extends AuriaException {
    getCode() {
        return "SYS.KERNEL.RESOURCES.RESOURCE_NOT_FOUND";
    }
}