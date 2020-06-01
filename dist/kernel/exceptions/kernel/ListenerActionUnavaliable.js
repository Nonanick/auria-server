import { AuriaException } from "../AuriaException.js";
export class ListenerActionUnavaliable extends AuriaException {
    getCode() {
        return "SYS.MODULE.ACTION_UNAVALIABLE";
    }
}
