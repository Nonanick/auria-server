import { SystemAuthenticator } from "../../security/auth/SystemAuthenticator";
import { SystemRequest } from "../../http/request/SystemRequest";
import { SystemUser } from "../../security/SystemUser";
import { System } from "../../System";
import * as jwt from 'jsonwebtoken';
import { AuthConfigType, AuthConfig } from "../../../config/Auth";


export type UserAuthInfo = {
    user_id: number;
    username: string;
    loginTime: number;
    targetedSystem: string;
    systemVersion: number;
};

type ValidateTokenInfo = {
    valid: boolean;
    authInfo: undefined | UserAuthInfo;
}

export class AuriaSystemAuthenticator extends SystemAuthenticator {
    

    protected jwtConfig: AuthConfigType;

    constructor(system : System) {
        super(system);
        this.jwtConfig = AuthConfig;
    }
    
    authenticate(user: SystemUser): Promise<any> {
        throw new Error("Method not implemented.");
    }

    isAuthenticated(user: SystemUser): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async authenticateRequest(request: SystemRequest): Promise<SystemUser> {

        let systemUser = new SystemUser(this.system, "guest");

        let token = request.headers['auria-access-token'];

        console.log("User Access Token:", token);

        if (token != undefined) {
            let validateToken = this.validateToken(token as string);
            if (validateToken.valid) {
                let tokenUsername = validateToken.authInfo!.username;
                let tokenSystem = validateToken.authInfo!.targetedSystem;

                if (tokenSystem == this.system.name && this.system.isUserLoggedIn(tokenUsername)) {
                    systemUser = this.system.getUser(tokenUsername)!;

                    console.log("[CoreAuthenticator] Request Token is valid and user is logged into the system!");
                }
            }
        }
        return systemUser;
    }

    /**
     * Generates an JSON Web Token to be used as an authentication by the user
     * ------------------------------------------------------------------------
     * 
     * @param user 
     */
    public generateAuthenticationToken(user: SystemUser): string {

        let userAuthInfo: UserAuthInfo = {
            loginTime: Date.now(),
            systemVersion: this.system.getSystemVersion(),
            targetedSystem: this.system.name,
            username: user.getUsername(),
            user_id: user.getId()
        };

        let token = jwt.sign(
            userAuthInfo,
            this.jwtConfig.jwtSecret,
            {
                expiresIn: '2 days'
            }
        );

        return token;
    }

    private validateToken(jwtToken: string): ValidateTokenInfo {
        try {
            let jwtDecipher: UserAuthInfo = jwt.verify(jwtToken, this.jwtConfig.jwtSecret, { maxAge: "2 days" }) as any;

            return {
                valid: true,
                authInfo: jwtDecipher
            };
        }
        catch (ex) {
            return {
                valid: false,
                authInfo: undefined
            };
        }

    }



}