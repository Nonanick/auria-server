import { AuriaException } from "../exceptions/AuriaException.js";
export class AuriaResponse {
    constructor(response, nextFunction) {
        this.responseData = {};
        this.beforeSend = [];
        this.sent = false;
        this.response = response;
        this.nextFn = nextFunction;
        this.sendData = {
            digest: "ok",
            error: "",
            exitCode: "0",
            response: {},
        };
    }
    error(codeOrException, message) {
        this.setDigestStatus("error");
        if (codeOrException instanceof AuriaException) {
            this.sendData.error = codeOrException.getMessage();
            this.sendData.exitCode = codeOrException.getCode();
        }
        else {
            this.sendData.error = message == null ? "" : message;
            this.sendData.exitCode = codeOrException;
        }
        this.send();
    }
    setDigestStatus(status) {
        this.sendData.digest = status;
        return this;
    }
    setRequestBody(requestBody) {
        this.sendData.requestBody = requestBody;
        return this;
    }
    setServerVersion(version) {
        this.sendData.serverVersion = version;
        return this;
    }
    addToResponse(data) {
        for (var a in data) {
            if (data.hasOwnProperty(a)) {
                this.responseData[a] = data[a];
            }
        }
    }
    send() {
        if (this.sent === false) {
            this.sent = true;
        }
        else {
            console.error("[AuriaResponse] Response was alread sent to client! Can't resend it");
            return;
        }
        this.sendData.response = this.responseData;
        if (this.beforeSend.length > 0) {
            let data = this.sendData;
            this.beforeSend.forEach((bSend) => {
                data = bSend(data);
            });
            this.sendData = data;
        }
        this.response.status(this.getStatusCode(this.sendData.digest));
        this.response.send(this.sendData);
        this.nextFn();
    }
    getRawResponse() {
        return this.response;
    }
    getStatusCode(digest) {
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
    isSent() {
        return this.sent;
    }
    getSendData() {
        return this.sendData;
    }
    getResponseData() {
        return this.responseData;
    }
    setCookie(name, value, expires = 1000 * 60 * 60 * 24, httpOnly = true) {
        this.response.cookie(name, value, {
            httpOnly: httpOnly,
            secure: true,
            maxAge: expires
        });
    }
}
