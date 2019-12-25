import { AuriaCoreSystem } from "../AuriaCoreSystem";
import { AuthConfigType } from "../../../config/Auth";
import { PasswordAutheticator } from "../../../kernel/security/auth/PasswordAuthenticator";
export declare class CoreAuthenticator extends PasswordAutheticator {
    protected jwtConfig: AuthConfigType;
    constructor(system: AuriaCoreSystem);
    protected getJwtSecret(): string;
}
