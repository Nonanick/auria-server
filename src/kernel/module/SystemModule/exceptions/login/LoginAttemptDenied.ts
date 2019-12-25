import { AuriaException } from "../../../../exceptions/AuriaException";

export class LoginAttemptDenied extends AuriaException {
    
    getCode(): string {
        return "SYS.LOGIN.ATTEMPT.DENIED";
    }


}