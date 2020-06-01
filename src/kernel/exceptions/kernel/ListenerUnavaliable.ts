import { AuriaException } from "../AuriaException.js";


export class ListenerUnavaliable extends AuriaException {
    
    getCode(): string {
       return "SYS.BAD_REQUEST.LISTENER_UNAVALIABLE";
    }

}