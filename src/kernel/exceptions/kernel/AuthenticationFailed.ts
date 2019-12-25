import { AuriaException } from "../AuriaException";

export class AuthenticationFailed extends AuriaException {
    getCode(): string {
        return "00041";
    }

}