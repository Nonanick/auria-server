import { CoreAuthenticator } from "./security/CoreAuthenticator";
import Knex = require("knex");
import { AuriaSystem } from "../../default/AuriaSystem";
import { PasswordAutheticator } from "../../kernel/security/auth/PasswordAuthenticator";
export declare class AuriaCoreSystem extends AuriaSystem {
    protected authenticator: CoreAuthenticator;
    constructor();
    protected buildSystemConnection(): Knex;
    getSystemConnection(): Knex;
    getAuthenticator(): PasswordAutheticator;
}
