import { Request } from "express-serve-static-core";
export interface ServerRequest extends Request {
    getRequiredParam: (...param: string[]) => any;
    getParam: (name: string) => any;
    hasParam: (name: string) => boolean;
    getIp: () => string;
    getUserAgent: () => string;
    getCookie: (name: string) => string;
}
export declare class ServerRequestFactory {
    static promote(request: Request): ServerRequest;
}
