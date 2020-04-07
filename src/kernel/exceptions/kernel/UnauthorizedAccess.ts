import { AuriaException } from "../AuriaException";

export class UnauthorizedAccess extends AuriaException {

    getHttpCode() {
        return 403;
    }

    getCode(): string {
        return "SYS.SECURITY.UNAUTHORIZED_ACCESS";
    }

}