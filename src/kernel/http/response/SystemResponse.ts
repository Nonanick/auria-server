import { RequestStack } from "../../RequestStack";
import { ResponseCookie } from "./ResponseCookie";
import { ResponseHeader } from "./ResponseHeader";
import { SystemUser } from "../../security/user/SystemUser";
import { ResponseError } from "./ResponseError";

export class SystemResponse {

    protected user: SystemUser;

    protected stack: RequestStack;

    protected responseData: any;

    protected httpStatusCode: number = SystemSuccessHttpCode;

    protected exitCode: string = SystemSuccessResponseCode;

    protected message: string;

    protected cookies: ResponseCookie[] = [];

    protected headers: ResponseHeader[] = [];

    protected errors: ResponseError[] = []

    constructor(
        {
            requestStack,
            user,
            cookies = [],
            headers = [],
            httpStatusCode = SystemSuccessHttpCode,
            exitCode = SystemSuccessResponseCode,
            message = SystemSuccessMessage,
            data = {}
        }: SystemResponseParams
    ) {
        this.stack = requestStack;
        this.user = user;
        this.cookies = cookies;
        this.headers = headers;
        this.httpStatusCode = httpStatusCode;
        this.exitCode = exitCode;
        this.message = message;
        this.responseData = data;
    }

    public setStatusCode(code: number) {
        if (code >= 100 && code < 600) {
            this.httpStatusCode = code;
        } else {
            throw new Error("HTTP Status code must be in range of [100-599]!");
        }
    }

    public addCookie(cookie: ResponseCookie) {
        this.cookies.push(cookie);
    }

    public addHeader(headerName: string, headerValue: string) {
        this.headers.push({
            name: headerName,
            value: headerValue
        });
    }

    public addError(errorCode: string, errorMessage: string, extra?: any) {
        this.errors.push({
            code: errorCode,
            message: errorMessage,
            extra: extra
        });
    }

    public addDataToResponse(data: any) {
        this.responseData = { ...this.responseData, data };
    }

    public setResponseObject(data: any) {
        this.responseData = data;
    }

    public getUser: () => SystemUser = () => {
        return this.user;
    };

    public asJSON: () => any = () => {
        return {
            httpCode: this.httpStatusCode,
            exitCode: this.exitCode,
            message: this.message,
            response: this.responseData,
            errors: this.errors
        }
    }

    public getAllHeaders() {
        return this.headers;
    }

    public getAllCookies() {
        return this.cookies;
    }

    public getHttpStatusCode() {
        return this.httpStatusCode;
    }
}

export interface SystemResponseParams {
    requestStack: RequestStack;
    user: SystemUser;
    cookies?: ResponseCookie[],
    headers?: ResponseHeader[],
    httpStatusCode?: number;
    exitCode?: string;
    message?: string;
    data?: any;
}

export const SystemSuccessResponseCode = "SYS.RESPONSE.SUCCESS";
export const SystemSuccessHttpCode = 200;
export const SystemSuccessMessage = "The request was processed successfully!";