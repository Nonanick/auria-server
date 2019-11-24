import { Authenticator } from "aurialib2";

export class PasswordAutheticator implements Authenticator {

    private __authenticated : boolean = false;

    private __password: string;

    authenticate(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async isAuthenticated(): Promise<boolean> {
        return this.__authenticated;
    }

    setCredentials(credentials: { password: string }): Authenticator {
        this.__password = credentials.password;
        console.log("Use password: ", this.__password, " and never be able to get it again!");
        return this;
    }


}