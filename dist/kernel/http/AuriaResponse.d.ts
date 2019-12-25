import { Response, NextFunction } from 'express-serve-static-core';
import { AuriaException } from '../exceptions/AuriaException';
export declare type RequestDigestStatus = "ok" | "error" | "failed" | "unauthorized";
export declare type AuriaResponseData = {
    digest: RequestDigestStatus;
    error: string;
    response: any;
    requestBody?: any;
    serverVersion?: number;
    exitCode: string;
};
export declare class AuriaResponse {
    protected response: Response;
    protected sendData: AuriaResponseData;
    protected responseData: any;
    protected nextFn: NextFunction;
    protected beforeSend: ((dataToBeSent: any) => any)[];
    private sent;
    constructor(response: Response, nextFunction: NextFunction);
    error(exception: AuriaException): void;
    error(code: string, message: string): void;
    setDigestStatus(status: RequestDigestStatus): this;
    setRequestBody(requestBody: any): AuriaResponse;
    setServerVersion(version: number): AuriaResponse;
    addToResponse(data: any): void;
    send(): void;
    getRawResponse(): Response<any>;
    getStatusCode(digest: RequestDigestStatus): number;
    isSent(): boolean;
    getSendData(): AuriaResponseData;
    getResponseData(): any;
    setCookie(name: string, value: string, expires?: number, httpOnly?: boolean): void;
}
