import { LoginAttemptManager } from './actions/login/LoginAttemptManager.js';
import { Module } from '../../Module.js';
import { AuriaListenerActionMetadata } from '../../../../default/module/listener/AuriaListenerActionMetadata.js';
import { ModuleListener } from '../../api/ModuleListener.js';
import { ListenerAction } from '../../api/ListenerAction.js';
export declare class LoginListener extends ModuleListener {
    static COOKIE_USER_NAME: string;
    static COOKIE_SESSION_TOKEN: string;
    static COOKIE_ACCESS_TOKEN: string;
    /**
     * Amount of time required to complete
     * the login request
     */
    static LOGIN_LISTENER_DELAY_LOGIN_ATTEMPT: number;
    protected loginAttemptManager: LoginAttemptManager;
    constructor(module: Module);
    getMetadataFromExposedActions(): AuriaListenerActionMetadata;
    /**
     * Login [Public]
     * ---------------
     *
     * Public method login will authenticate a combination of username + password
     * and subscribe the user to the system allowing requisitions signed with said
     * user will be able to be processed
     *
     */
    login: ListenerAction;
    /**
     * Check Login Credentials
     * -----------------------
     *
     * Privatly used by public method "login", will try to authenticate
     * a combination of username + password on this system DB
     *
     * If the combinations succeeds a resolved promise with *SystemAuthLoginDetails* is returned
     * if it fails a rejected promise is returned
     */
    private __checkLoginCredentials;
    /**
     * Subscribe User to System
     * --------------------------
     *
     * Creates a new *SystemUser* based on the *SystemLoginAuthDetails*
     * returned by the authentication method
     *
     */
    private __subscribeUserToSystem;
    /**
     * Prepare Login Response Headers
     * -------------------------------
     *
     * Prepare the httpOnly Cookies containing the username AND refresh token
     * in case a 'keep-signed-in' parameter was passed
     *
     * RefreshToken will expiry after a month after login!
     *
     */
    private __prepareLoginResponseHeaders;
    /**
     * Save User Session
     * -----------------
     *
     * Called when the "keep-signed-in" parameter is passed with a login request
     * A new session will be stored in the DB and a httpOnly Cookie will be generated
     * When the API need to retrieve an Access Token this method is accessed out of the SPA
     * context so the httpOnly Cookie can be passed along!
     */
    private __saveUserSession;
    /**
     * Logout [Public]
     * ----------------
     */
    logout: ListenerAction;
    private __destroyAllCookies;
    handshake: ListenerAction;
    private __checkSessionTokenPayload;
    private __checkSessionSender;
    private __verifyDatabaseSessionToken;
    hashPassword: ListenerAction;
}
export interface LoginSessionInfo {
    username: string;
    login_time: Date;
    machine_ip: string;
    token: string;
    system: string;
    client: string;
    user_agent: string;
}
