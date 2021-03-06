import { AuriaException } from "../../../../exceptions/AuriaException.js";


export class LoginAttemptDenied extends AuriaException {
    
    getCode(): string {
        return "SYS.LOGIN.ATTEMPT.DENIED";
    }


}