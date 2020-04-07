import { System } from "../../kernel/System";
import { AuthConfigType, AuthConfig } from "../../config/Auth";
import { PasswordAutheticator } from "../../kernel/security/auth/PasswordAuthenticator";


export type UserAuthInfo = {
    user_id: number;
    username: string;
    loginTime: number;
    targetedSystem: string;
    systemVersion: number;
};


export class AuriaSystemAuthenticator extends PasswordAutheticator {

    protected jwtConfig: AuthConfigType;

    constructor(system: System) {
        super(system);
        this.jwtConfig = AuthConfig;
    }

    protected getJwtSecret(): string {
        return this.jwtConfig.jwtSecret;
    }


}