export class ServerRequestFactory {
    static promote(request) {
        let bodyData = Object.assign({}, request.body, request.query);
        let serverReq = Object.assign({
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
        }, request);
        return serverReq;
    }
}
