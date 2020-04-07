export interface LoginAttempt {

    attemptIdentification: LoginAttempIdentification;
    timestamp: Date;
    username: string;
    success: boolean;

}

export type LoginAttempIdentification = {
    ip: string;
    userAgent: string;
};
