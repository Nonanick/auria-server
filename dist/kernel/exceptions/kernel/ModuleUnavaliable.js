import { AuriaException } from "../AuriaException.js";
export class ModuleUnavaliable extends AuriaException {
    getCode() {
        return "00002";
    }
}
