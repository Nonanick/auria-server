import { AuriaException } from "../AuriaException";

export class ListenerUnavaliable extends AuriaException {
    
    getCode(): string {
       return "SYS.BAD_REQUEST.LISTENER_UNAVALIABLE";
    }

}