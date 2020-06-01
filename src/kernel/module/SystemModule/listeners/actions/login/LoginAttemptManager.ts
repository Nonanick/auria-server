import { LoginAttempt, LoginAttempIdentification } from "./LoginAttempt.js";
import { ListenerRequest } from "../../../../../http/request/ListenerRequest.js";
import { LoginAttemptDenied } from "../../../exceptions/login/LoginAttemptDenied.js";

export class LoginAttemptManager {

    /**
     * Maximun amount of times that the user may request to login
     * without succeding
     * 
     */
    static LOGIN_ATTEMPT_MAX_TRIES = 5;

    /**
     * 
     */
    static LOGIN_ATTEMPT_COOLDOWN = 60 * 2;

    static LOGIN_ATTEMPT_EXPIRE_TIME = 60 * 60 * 2;

    private allLoginAttempts: LoginAttempt[];

    private attemptsPerIdentification: Map<string, LoginAttempt[]>;

    private attemptsPerUsername: Map<string, LoginAttempt[]>;

    /**
     * Login Attempt Manager
     * ---------------------
     * 
     * A security layer that prevents brute force
     * 
     * Every login attempt should first verify if the
     * request has not exceeded the max amount of times allowed
     * to be failed
     */
    constructor() {

        this.allLoginAttempts = [];
        this.attemptsPerIdentification = new Map();
        this.attemptsPerUsername = new Map();

    }

    /**
     * Request Login Attempt
     * ----------------------
     * 
     * Will request to the manager a new LoginAttempt object,
     * will throw an Error in case the request cannot be done!
     * 
     * @param request 
     */
    public requestLoginAttempt(request: ListenerRequest): LoginAttempt {

        let reqId: LoginAttempIdentification = {
            ip: request.getIp(),
            userAgent: request.getUserAgent()
        };

        let username = request.getRequiredParam('username');

        if (
            this.verifyAttemptIdentification(reqId)
            && this.verifyAttemptUsername(username)
        ) {
            return this.createLoginAttempt(request);
        } else {
            throw new LoginAttemptDenied("Failed to login, you exceeded the amount of tries! Please wait for a bit and try again!", { attempt_cooldown: LoginAttemptManager.LOGIN_ATTEMPT_COOLDOWN });
        }
    }

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
    public clearLoginAttempts(request: ListenerRequest): {
        perUsername: LoginAttempt[],
        perIdentification: LoginAttempt[]
    } {

        let username: string = request.getRequiredParam('username');
        let id: string = this.getStringFromIdentification({
            ip: request.getIp(),
            userAgent: request.getUserAgent()
        });

        let usernameAttempts = this.attemptsPerUsername.get(username)!;
        let idAttempts = this.attemptsPerIdentification.get(id)!;

        this.attemptsPerIdentification.delete(id);
        this.attemptsPerUsername.delete(username);

        let allAttempts: LoginAttempt[] = ([] as LoginAttempt[]).concat(usernameAttempts, idAttempts);

        //Delete from allLoginAttempts
        allAttempts.forEach((attempt) => {
            this.destroyLoginAttempt(attempt);
        });

        return {
            perIdentification: idAttempts,
            perUsername: usernameAttempts
        };
    }

    /**
     * Verify Attempt by Identification
     * ---------------------------------
     * 
     * Check if the request IP + UserAgent exceeded the maximun amount of times
     * allowed to try and login
     * 
     * @param id Object containing IP + UserAgent
     */
    private verifyAttemptIdentification(id: LoginAttempIdentification): boolean {
        /*
            @todo study the necessity of UserAgent, for now it seems... bleh

            Should i botter with User Agent ??
            This was supposed to block multiple login requests from the same client
            with different usernames, if the invader tries to change its own Ip + UserAgent
            to brute force a password from a user it should be stopped by the "verifyAttemptUsername"
        */

        // Is there any other attempts from the same Ip + " | " + UserAgent
        let idString: string = this.getStringFromIdentification(id);

        if (this.attemptsPerIdentification.has(idString)) {

            let attempts: LoginAttempt[] = this.attemptsPerIdentification.get(idString)!;
            return this.verifyAttempts(attempts);

        }
        // Old request from same identification does not exists, OK
        else {
            return true;

        }

    }

    /**
     * Verify Attempt by Username
     * ---------------------------------
     * 
     * Check if the request username exceeded the maximun amount of times
     * allowed to try and login
     * 
     * @param username 
     */
    private verifyAttemptUsername(username: string): boolean {

        if (this.attemptsPerUsername.has(username)) {
            let attempts: LoginAttempt[] = this.attemptsPerUsername.get(username)!;
            return this.verifyAttempts(attempts);
        }
        // No request for curent username, OK
        else {
            return true;
        }

    }


    /**
     * Verify if an array of LoginAttempts is suited to perform a new LoginRequest
     * 
     * @param attempts 
     */
    private verifyAttempts(attempts: LoginAttempt[]) {

        // Clear old attempts, defined by the LOGIN_ATTEMPT_EXPIRE_TIME
        this.clearAttempts(attempts);

        // number of attempts lesser than the permitted ? OK
        if (attempts.length <= LoginAttemptManager.LOGIN_ATTEMPT_MAX_TRIES) {
            return true;
        }

        //Max tries reached but cooldown since last attempt is exceeded? OK
        let lastAttempt = attempts[attempts.length - 1];
        let timeDifferenceInSeconds: number = Math.abs(Date.now() - lastAttempt.timestamp.getTime()) / 1000;
        if (timeDifferenceInSeconds > LoginAttemptManager.LOGIN_ATTEMPT_COOLDOWN) {
            return true;
        }

        return false;

    }

    /**
     * Clear Attempts
     * ---------------
     * 
     * Clear attempts older than LOGIN_ATTEMPT_EXPIRE_TIME
      */
    private clearAttempts(attempts: LoginAttempt[]) {

        for (const [index, attempt] of attempts.entries()) {
            let timeDiffInSeconds = (Date.now() - attempt.timestamp.getTime()) / 1000;

            // If the login attempt is older than the defined expire time, destroy it
            if (timeDiffInSeconds > LoginAttemptManager.LOGIN_ATTEMPT_EXPIRE_TIME) {
                let allAttemptsIndex = this.allLoginAttempts.indexOf(attempt);
                this.allLoginAttempts.splice(allAttemptsIndex, 1);
                attempts.splice(index, 1);
            }
            // All LoginAttempts are placed ordered by timestamp (somewhat), so if one is not older than expire time, break the loop;
            else {
                break;
            }
        }
    }

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
    private createLoginAttempt(loginRequest: ListenerRequest): LoginAttempt {

        let attempt: LoginAttempt = {
            attemptIdentification: {
                ip: loginRequest.getIp(),
                userAgent: loginRequest.getUserAgent()
            },
            timestamp: new Date(),
            username: loginRequest.getRequiredParam("username"),
            success: false
        };

        // Put it on AllLoginAttempts array
        this.allLoginAttempts.push(attempt);

        // Put it on UsernameAttempts array
        if (this.attemptsPerUsername.has(attempt.username)) {
            this.attemptsPerUsername.get(attempt.username)!.push(attempt);
        } else {
            this.attemptsPerUsername.set(attempt.username, [attempt]);
        }

        // Put it on AttemptIdentification array
        let idString: string = this.getStringFromIdentification(attempt.attemptIdentification);
        if (this.attemptsPerIdentification.has(idString)) {
            this.attemptsPerIdentification.get(idString)!.push(attempt);
        } else {
            this.attemptsPerIdentification.set(idString, [attempt]);
        }

        return attempt;
    }

    /**
     * Destroy Login Attempt
     * ----------------------
     * 
     * Remove attempt from allLoginAttempt
     * 
     * @param attempt 
     */
    private destroyLoginAttempt(attempt: LoginAttempt) {
        let allAttemptsIndex = this.allLoginAttempts.indexOf(attempt);
        this.allLoginAttempts.splice(allAttemptsIndex, 1);
    }

    /**
     * Get String from Identification
     * ------------------------------
     * 
     * Return the concatened string of the user IP + " | " + UserAgent 
     * @param id 
     */
    private getStringFromIdentification(id: LoginAttempIdentification) {
        return id.ip + " | " + id.userAgent;
    }
}