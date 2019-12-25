import { Request } from "express-serve-static-core";

export interface ServerRequest extends Request {

    getRequiredParam: (...param: string[]) => any;
    getParam: (name: string) => any;
    hasParam: (name: string) => boolean;
    getIp: () => string;
    getUserAgent: () => string;
    getCookie: (name: string) => string;

}

export class ServerRequestFactory {
    public static promote(request: Request): ServerRequest {
        let bodyData = Object.assign({}, request.body, request.query);

        let serverReq: ServerRequest = Object.assign({
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
        }, request);

        return serverReq;
    }
}