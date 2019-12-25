import { AuriaException } from "../AuriaException";

export class ListenerActionUnavaliable extends AuriaException {

    getCode(): string {
        return "00007";
    }

}