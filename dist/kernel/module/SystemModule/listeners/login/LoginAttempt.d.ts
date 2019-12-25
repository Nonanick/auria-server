export interface LoginAttempt {
    attemptIdentification: LoginAttempIdentification;
    timestamp: Date;
    username: string;
    success: boolean;
}
export declare type LoginAttempIdentification = {
    ip: string;
    userAgent: string;
};
