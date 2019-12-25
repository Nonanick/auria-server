import { AuriaException } from "../AuriaException";

export class ModuleUnavaliable extends AuriaException {

    getCode(): string {
        return "00002";
    }

}