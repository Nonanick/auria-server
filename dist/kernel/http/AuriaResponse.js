"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaException_1 = require("../exceptions/AuriaException");
class AuriaResponse {
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
        if (codeOrException instanceof AuriaException_1.AuriaException) {
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
exports.AuriaResponse = AuriaResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFSZXNwb25zZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvaHR0cC9BdXJpYVJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaUVBQThEO0FBYTlELE1BQWEsYUFBYTtJQWN0QixZQUFZLFFBQWtCLEVBQUUsWUFBMEI7UUFSaEQsaUJBQVksR0FBUSxFQUFFLENBQUM7UUFJdkIsZUFBVSxHQUFtQyxFQUFFLENBQUM7UUFFbEQsU0FBSSxHQUFZLEtBQUssQ0FBQztRQUcxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ1osTUFBTSxFQUFFLElBQUk7WUFDWixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxHQUFHO1lBQ2IsUUFBUSxFQUFFLEVBQUU7U0FDZixDQUFBO0lBQ0wsQ0FBQztJQUlNLEtBQUssQ0FBQyxlQUFzQyxFQUFFLE9BQWlCO1FBRWxFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUIsSUFBRyxlQUFlLFlBQVksK0JBQWMsRUFBRTtZQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3REO2FBQU07WUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxlQUF5QixDQUFDO1NBQ3REO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFF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