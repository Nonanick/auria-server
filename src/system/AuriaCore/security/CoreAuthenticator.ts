import { AuriaCoreSystem } from "../AuriaCoreSystem";
import { AuthConfig, AuthConfigType } from "../../../config/Auth";
import { PasswordAutheticator } from "../../../kernel/security/auth/PasswordAuthenticator";

export class CoreAuthenticator extends PasswordAutheticator {

    protected jwtConfig: AuthConfigType;

    constructor(system: AuriaCoreSystem) {
        super(system);
        this.jwtConfig = AuthConfig;
    }

    protected getJwtSecret(): string {
        return this.jwtConfig.jwtSecret;
    }

}