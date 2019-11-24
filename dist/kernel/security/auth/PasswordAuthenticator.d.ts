import { Authenticator } from "aurialib2";
export declare class PasswordAutheticator implements Authenticator {
    private __authenticated;
    private __password;
    authenticate(): Promise<any>;
    isAuthenticated(): Promise<boolean>;
    setCredentials(credentials: {
        password: string;
    }): Authenticator;
}
