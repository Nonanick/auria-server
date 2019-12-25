import { LoginAttempt } from "./LoginAttempt";
import { ListenerRequest } from "../../../../http/request/ListenerRequest";
export declare class LoginAttemptManager {
    /**
     * Maximun amount of times that the user may request to login
     * without succeding
     *
     */
    static LOGIN_ATTEMPT_MAX_TRIES: number;
    /**
     *
     */
    static LOGIN_ATTEMPT_COOLDOWN: number;
    static LOGIN_ATTEMPT_EXPIRE_TIME: number;
    private allLoginAttempts;
    private attemptsPerIdentification;
    private attemptsPerUsername;
    /**
     * Login Attempt Manager
     * ---------------------
     *
     * A security layer that prevents brute force
     *
     * Ever login attempt should first verify if the
     * request has not exceeded the max amount of times allowed
     * to be failed
     */
    constructor();
    /**
     * Request Login Attempt
     * ----------------------
     *
     * Will request to the manager a new LoginAttempt object,
     * will throw an Error in case the request cannot be done!
     *
     * @param request
     */
    requestLoginAttempt(request: ListenerRequest): LoginAttempt;
    /**
     * Clear login attempts
     * ---------------------
     *
     * Used when a user successfully logs in, all the previous attempts are erased
     *
     * @todo warn the user of the amount of attemps before loggin in?
     *
     * @param request
     */
    clearLoginAttempts(request: ListenerRequest): {
        perUsername: LoginAttempt[];
        perIdentification: LoginAttempt[];
    };
    /**
     * Verify Attempt by Identification
     * ---------------------------------
     *
     * Check if the request IP + UserAgent exceeded the maximun amount of times
     * allowed to try and login
     *
     * @param id Object containing IP + UserAgent
     */
    private verifyAttemptIdentification;
    /**
     * Verify Attempt by Username
     * ---------------------------------
     *
     * Check if the request username exceeded the maximun amount of times
     * allowed to try and login
     *
     * @param username
     */
    private verifyAttemptUsername;
    /**
     * Verify if an array of LoginAttempts is suited to perform a new LoginRequest
     *
     * @param attempts
     */
    private verifyAttempts;
    /**
     * Clear Attempts
     * ---------------
     *
     * Clear attempts older than LOGIN_ATTEMPT_EXPIRE_TIME
      */
    private clearAttempts;
    /**
     * Create Login Attempt
     * --------------------
     *
     * Create a LoginAttempt based on the HTTP request made
     *
     * This function does not veerif if the request CAN be done, please
     * to be sure that the request has permission to attempt to login use
     * *requestLoginAttempt";
     *
     * @param loginRequest
     */
    private createLoginAttempt;
    /**
     * Destroy Login Attempt
     * ----------------------
     *
     * Remove attempt from allLoginAttempt
     *
     * @param attempt
     */
    private destroyLoginAttempt;
    /**
     * Get String from Identification
     * ------------------------------
     *
     * Return the concatened string of the user IP + " | " + UserAgent
     * @param id
     */
    private getStringFromIdentification;
}
