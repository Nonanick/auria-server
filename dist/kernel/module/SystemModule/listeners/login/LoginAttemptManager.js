"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoginAttemptDenied_1 = require("../../exceptions/login/LoginAttemptDenied");
class LoginAttemptManager {
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
    requestLoginAttempt(request) {
        let reqId = {
            ip: request.getIp(),
            userAgent: request.getUserAgent()
        };
        let username = request.getRequiredParam('username');
        if (this.verifyAttemptIdentification(reqId)
            && this.verifyAttemptUsername(username)) {
            return this.createLoginAttempt(request);
        }
        else {
            throw new LoginAttemptDenied_1.LoginAttemptDenied("Failed to login, you exceeded the amount of tries! Please wait for a bit and try again!");
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
    clearLoginAttempts(request) {
        let username = request.getRequiredParam('username');
        let id = this.getStringFromIdentification({
            ip: request.getIp(),
            userAgent: request.getUserAgent()
        });
        let usernameAttempts = this.attemptsPerUsername.get(username);
        let idAttempts = this.attemptsPerIdentification.get(id);
        this.attemptsPerIdentification.delete(id);
        this.attemptsPerUsername.delete(username);
        let allAttempts = [].concat(usernameAttempts, idAttempts);
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
    verifyAttemptIdentification(id) {
        /*
            @todo study the necessity of UserAgent, for now it seems... bleh

            Should i botter with User Agent ??
            This was supposed to block multiple login requests from the same client
            with different usernames, if the invader tries to change its own Ip + UserAgent
            to brute force a password from a user it should be stopped by the "verifyAttemptUsername"
        */
        // Is there any other attempts from the same Ip + " | " + UserAgent
        let idString = this.getStringFromIdentification(id);
        if (this.attemptsPerIdentification.has(idString)) {
            let attempts = this.attemptsPerIdentification.get(idString);
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
    verifyAttemptUsername(username) {
        if (this.attemptsPerUsername.has(username)) {
            let attempts = this.attemptsPerUsername.get(username);
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
    verifyAttempts(attempts) {
        // Clear old attempts, defined by the LOGIN_ATTEMPT_EXPIRE_TIME
        this.clearAttempts(attempts);
        // number of attempts lesser than the permitted ? OK
        if (attempts.length <= LoginAttemptManager.LOGIN_ATTEMPT_MAX_TRIES) {
            return true;
        }
        //Max tries reached but cooldown since last attempt is exceeded? OK
        let lastAttempt = attempts[attempts.length - 1];
        let timeDifferenceInSeconds = Math.abs(Date.now() - lastAttempt.timestamp.getTime()) / 1000;
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
    clearAttempts(attempts) {
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
    createLoginAttempt(loginRequest) {
        let attempt = {
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
            this.attemptsPerUsername.get(attempt.username).push(attempt);
        }
        else {
            this.attemptsPerUsername.set(attempt.username, [attempt]);
        }
        // Put it on AttemptIdentification array
        let idString = this.getStringFromIdentification(attempt.attemptIdentification);
        if (this.attemptsPerIdentification.has(idString)) {
            this.attemptsPerIdentification.get(idString).push(attempt);
        }
        else {
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
    destroyLoginAttempt(attempt) {
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
    getStringFromIdentification(id) {
        return id.ip + " | " + id.userAgent;
    }
}
/**
 * Maximun amount of times that the user may request to login
 * without succeding
 *
 */
LoginAttemptManager.LOGIN_ATTEMPT_MAX_TRIES = 5;
/**
 *
 */
LoginAttemptManager.LOGIN_ATTEMPT_COOLDOWN = 60 * 2;
LoginAttemptManager.LOGIN_ATTEMPT_EXPIRE_TIME = 60 * 60 * 2;
exports.LoginAttemptManager = LoginAttemptManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5BdHRlbXB0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvbG9naW4vTG9naW5BdHRlbXB0TWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGtGQUErRTtBQUUvRSxNQUFhLG1CQUFtQjtJQXVCNUI7Ozs7Ozs7OztPQVNHO0lBQ0g7UUFFSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRXpDLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLG1CQUFtQixDQUFDLE9BQXdCO1FBRS9DLElBQUksS0FBSyxHQUE4QjtZQUNuQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNuQixTQUFTLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRTtTQUNwQyxDQUFDO1FBRUYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXBELElBQ0ksSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQztlQUNwQyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLEVBQ3pDO1lBQ0UsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNILE1BQU0sSUFBSSx1Q0FBa0IsQ0FBQyx5RkFBeUYsQ0FBQyxDQUFDO1NBQzNIO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLGtCQUFrQixDQUFDLE9BQXdCO1FBSzlDLElBQUksUUFBUSxHQUFXLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RCxJ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