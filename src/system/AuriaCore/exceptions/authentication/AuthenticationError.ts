import { AuriaException } from "../../../../kernel/exceptions/AuriaException";

export class AuthenticationError extends AuriaException {

    getCode() {
        return "CORESYS.AUTH.FAILED";
    }
    
}