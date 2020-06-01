import { AuriaException } from "../AuriaException.js";


export class ListenerActionUnavaliable extends AuriaException {

    getCode(): string {
        return "SYS.MODULE.ACTION_UNAVALIABLE";
    }

}