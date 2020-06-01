import { AuthConfigType, AuthConfig } from "../../config/Auth.js";
import { System } from "../../kernel/System.js";
import { PasswordAutheticator } from "../../kernel/security/auth/PasswordAuthenticator.js";

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