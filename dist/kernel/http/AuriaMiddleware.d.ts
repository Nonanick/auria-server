import { AuriaRequest } from "./AuriaRequest";
import { AuriaResponse } from "./AuriaResponse";
import { Request, Response } from "express-serve-static-core";
export declare abstract class AuriaMiddleware {
    protected req: AuriaRequest;
    protected expressReq: Request;
    protected res: AuriaResponse;
    protected expressRes: Response;
    protected nextHandler: AuriaMiddleware | undefined;
    constructor(req: AuriaRequest, res: AuriaResponse, next?: AuriaMiddleware);
    abstract handle(): number;
}
