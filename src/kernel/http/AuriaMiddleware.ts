import { AuriaRequest } from "./AuriaRequest";
import { AuriaResponse } from "./AuriaResponse";
import { Request, Response } from "express-serve-static-core";

export abstract class AuriaMiddleware {

    protected req : AuriaRequest;
    protected expressReq : Request;

    protected res : AuriaResponse;
    protected expressRes : Response;

    protected nextHandler : AuriaMiddleware | undefined;

    constructor(req : AuriaRequest, res : AuriaResponse, next? : AuriaMiddleware) {
        
        this.req = req;
        this.expressReq = req.getRawRequest();
        
        this.res = res;
        this.expressRes = res.getRawResponse();

        this.nextHandler = next;
    }

    public abstract handle() : number;

}