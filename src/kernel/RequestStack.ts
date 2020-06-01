import { Request } from "express";

/**
 * Request Stack
 * --------------
 */
export class RequestStack {

    /**
     * Original, unmodified, request URL
     */
    protected url: string;

    /**
     * System Name
     * ------------
     * 
     * Targeted system that wil handle the request
     * 
     */
    protected systemName: string;

    /**
     * Module Name
     * -------------
     * 
     */
    protected moduleName: string;

    /**
     * Listener Name
     * ---------------
     * 
     */
    protected listenerName: string;

    /**
     * Action Name
     * --------------
     * 
     */
    protected actionName: string;

    /**
     * Replace Digest Function
     * -------------------------
     * 
     * Modifies how the Request should be digested
     * It affects ALL systems in the AuriaServer!
     * 
     * @param fn 
     */
    public static replaceDigestFunction(fn : (req : Request) => RequestStack) {
        RequestStack.digestRequest = fn;
    }

    /**
     * Digest Request
     * ---------------
     * 
     * Extracts from the Request the targeted System, Module, Listener and Action!
     * 
     * By default this function expects the URL following the pattern:
     * {SystemName}/{ModuleName}/{ListenerName}/{ActionName?}
     * 
     * But you can replace this behaviour using "RequestStack.replaceDigestFunction"
     * 
     */
    public static digestRequest: (req: Request) => RequestStack = (req: Request) => {

        let stack: RequestStack = new RequestStack();

        let urlPieces: string[] = req.path.split('/');

        let system: string = urlPieces[1] != null ? urlPieces[1] : "";
        let moduleName: string = urlPieces[2] != null ? urlPieces[2] : "";
        let listener: string = urlPieces[3] != null ? urlPieces[3] : "";
        let action: string = urlPieces[4] != null ? urlPieces[4] : "default";

        stack.url = req.originalUrl;

        stack.systemName = system;
        stack.moduleName = moduleName;
        stack.listenerName = listener;
        stack.actionName = action;

        return stack;
    }

    /**
     * Request Stack
     * -------------
     * 
     * Defines how URL's should be handled!
     * This class must digest the express request and expose the desired:
     *  1) System name
     *  2) Module
     *  3) Listener
     *  4) Action
     * 
     * By default it uses the following pattern:
     * {SystemName}/{ModuleName}/{ListenerName}/{ActionName?}
     */
    private constructor() {

    }

    /**
     * [Alias] Requested System
     * ------------------------
     * 
     */
    public system(): string {
        return this.systemName;
    }
    /**
     * Requested System
     * -----------------
     * 
     * Return the requested system name
     * it may or may not exist in the server
     */
    public requestedSystem(): string {
        return this.systemName;
    }

    public module(): string {
        return this.moduleName;
    }
    
    public requestedModule(): string {
        return this.moduleName;
    }

    public listener(): string {
        return this.listenerName;
    }

    public action(): string {
        return this.actionName;
    }

    public getUrl(): string {
        return this.url;
    }

}