import { AuriaException } from "../AuriaException";

export class UserNotLoggedIn extends AuriaException {
    
    getCode(): string {
        return "SYS.SECURITY.USER_NOT_LOGGED_IN";
    }


}