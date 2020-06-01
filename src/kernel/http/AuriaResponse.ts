import { Response, NextFunction } from 'express-serve-static-core';
import { AuriaException } from "../exceptions/AuriaException.js";

export type RequestDigestStatus = "ok" | "error" | "failed" | "unauthorized";

export type AuriaResponseData = {
    digest: RequestDigestStatus;
    error: string;
    response: any;
    requestBody?: any;
    serverVersion?: number;
    exitCode: string;
};

export class AuriaResponse {

    protected response: Response;

    protected sendData: AuriaResponseData;

    protected responseData: any = {};

    protected nextFn: NextFunction;

    protected beforeSend: ((dataToBeSent: any) => any)[] = [];

    private sent: boolean = false;

    constructor(response: Response, nextFunction: NextFunction) {
        this.response = response;
        this.nextFn = nextFunction;
        this.sendData = {
            digest: "ok",
            error: "",
            exitCode: "0",
            response: {},
        }
    }

    public error(exception : AuriaException) : void;
    public error(code: string, message: string) : void;
    public error(codeOrException: string|AuriaException, message? : string) {
        
        this.setDigestStatus("error");

        if(codeOrException instanceof AuriaException) {
            this.sendData.error = codeOrException.getMessage();
            this.sendData.exitCode = codeOrException.getCode();
        } else {
            this.sendData.error = message == null ? "" : message;
            this.sendData.exitCode = codeOrException as string;
        }
        this.send();
    }

    public setDigestStatus(status: RequestDigestStatus) {
        this.sendData.digest = status;
        return this;
    }

    public setRequestBody(requestBody: any): AuriaResponse {
        this.sendData.requestBody = requestBody;
        return this;
    }

    public setServerVersion(version: number): AuriaResponse {
        this.sendData.serverVersion = version;
        return this;
    }
    
    public addToResponse(data: any) {
        for (var a in data) {
            if (data.hasOwnProperty(a)) {
                this.responseData[a] = data[a];
            }
        }
    }

    public send() {

        if (this.sent === false) {
            this.sent = true;
        } else {
            console.error("[AuriaResponse] Response was alread sent to client! Can't resend it");
            return;
        }

        this.sendData.response = this.responseData;

        if (this.beforeSend.length > 0) {

            let data: any = this.sendData;
            this.beforeSend.forEach((bSend) => {
                data = bSend(data);
            });

            this.sendData = data;
        }

        this.response.status(this.getStatusCode(this.sendData.digest));
        this.response.send(this.sendData);

        this.nextFn();
    }

    public getRawResponse() {
        return this.response;
    }

    public getStatusCode(digest: RequestDigestStatus): number {

        switch (digest) {
            case "failed":
                return 500;
            case "error":
            case "ok":
                return 200;
            case "unauthorized":
                return 403;

        }
    }

    public isSent(): boolean {
        return this.sent;
    }

    public getSendData() {
        return this.sendData;
    }

    public getResponseData() {
        return this.responseData;
    }

    public setCookie(name: string, value: string, expires: number = 1000 * 60 * 60 * 24, httpOnly: boolean = true) {
        this.response.cookie(name, value, {
            httpOnly: httpOnly,
            secure: true,
            maxAge: expires
        });
    }

}