import { Request } from "express-serve-static-core";
export interface ServerRequest {
    params: any;
    headers: {
        [headerName: string]: string | string[] | undefined;
    };
    cookies: {
        [cookieName: string]: string | undefined;
    };
    getRequiredParam: (...param: string[]) => any;
    getOptionalParam: (param: string, defaultValue?: any) => any;
    getParam: (name: string) => any;
    hasParam: (name: string) => boolean;
    getIp: () => string;
    getUserAgent: () => string;
    getCookie: (name: string) => string;
}
export declare class ServerRequestFactory {
    static promote(request: Request): ServerRequest;
}
