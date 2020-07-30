import { Request } from "express-serve-static-core";

export interface ServerRequest {
    params: any;
    headers: { [headerName: string]: string | string[] | undefined };
    cookies: { [cookieName: string]: string | undefined }
    getRequiredParam: (...param: string[]) => any;
    getOptionalParam: (param: string, defaultValue?: any) => any;
    getParam: (name: string) => any;
    hasParam: (name: string) => boolean;
    getIp: () => string;
    getUserAgent: () => string;
    getCookie: (name: string) => string;

}

export class ServerRequestFactory {
    public static promote(request: Request): ServerRequest {

        let bodyData = { ...request.body, ...request.query, ...request.params };

        console.log("[BodyData]", bodyData);
        let requestHeaders = { ...request.headers };
        let requestCookies = { ...request.cookies };

        let serverReq: ServerRequest = {
            params: bodyData,
            headers: requestHeaders,
            cookies: requestCookies,
            //
            getRequiredParam: (...param: string[]) => {
                let properAns: string | { [param: string]: string } = {};

                param.forEach((p: string) => {
                    if (bodyData[p] != null) {
                        if (param.length == 1) {
                            properAns = bodyData[p];
                        } else {
                            (properAns as any)[p] = bodyData[p];
                        }
                    } else {
                        console.error("[AuriaRequest] Failed to proccess request, parameter '" + p + "' was not provided!");
                        throw new Error("Wrong request, a required parameter was not provided!");
                    }
                });

                return properAns;
            },
            getOptionalParam: (name: string, defaultValue = null) => {
                if (bodyData[name] === undefined)
                    return defaultValue;

                return bodyData[name];
            },

            //
            getParam: (name: string) => {
                if (bodyData[name] == null) {
                    return "";
                } else {
                    return bodyData[name];
                }
            },

            //
            hasParam: (name: string) => {
                return bodyData[name] !== undefined;
            },

            //
            getIp: () => {
                return request.ip;
            },

            //
            getUserAgent: () => {
                return request.headers['user-agent'] as string;
            },

            //
            getCookie: (name: string) => {
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