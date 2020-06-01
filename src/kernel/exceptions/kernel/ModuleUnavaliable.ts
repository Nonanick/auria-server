import { AuriaException } from "../AuriaException.js";


export class ModuleUnavaliable extends AuriaException {

    getCode(): string {
        return "00002";
    }

}