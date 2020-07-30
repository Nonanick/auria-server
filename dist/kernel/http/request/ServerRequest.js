export class ServerRequestFactory {
    static promote(request) {
        let bodyData = Object.assign(Object.assign(Object.assign({}, request.body), request.query), request.params);
        console.log("[BodyData]", bodyData);
        let requestHeaders = Object.assign({}, request.headers);
        let requestCookies = Object.assign({}, request.cookies);
        let serverReq = {
            params: bodyData,
            headers: requestHeaders,
            cookies: requestCookies,
            //
            getRequiredParam: (...param) => {
                let properAns = {};
                param.forEach((p) => {
                    if (bodyData[p] != null) {
                        if (param.length == 1) {
                            properAns = bodyData[p];
                        }
                        else {
                            properAns[p] = bodyData[p];
                        }
                    }
                    else {
                        console.error("[AuriaRequest] Failed to proccess request, parameter '" + p + "' was not provided!");
                        throw new Error("Wrong request, a required parameter was not provided!");
                    }
                });
                return properAns;
            },
            getOptionalParam: (name, defaultValue = null) => {
                if (bodyData[name] === undefined)
                    return defaultValue;
                return bodyData[name];
            },
            //
            getParam: (name) => {
                if (bodyData[name] == null) {
                    return "";
                }
                else {
                    return bodyData[name];
                }
            },
            //
            hasParam: (name) => {
                return bodyData[name] !== undefined;
            },
            //
            getIp: () => {
                return request.ip;
            },
            //
            getUserAgent: () => {
                return request.headers['user-agent'];
            },
            //
            getCookie: (name) => {
                if (request.cookies != null) {
                    return request.cookies[name] == null ? "" : request.cookies[name];
                }
                else
                    return "";
            }
        };
        return serverReq;
    }
}
//# sourceMappingURL=ServerRequest.js.map