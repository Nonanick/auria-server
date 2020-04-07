import { AuriaException } from "../AuriaException";

export class ListenerActionUnavaliable extends AuriaException {

    getCode(): string {
        return "SYS.MODULE.ACTION_UNAVALIABLE";
    }

}