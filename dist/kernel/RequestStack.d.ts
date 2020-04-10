import { Request } from "express";
/**
 * Request Stack
 * --------------
 */
export declare class RequestStack {
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
    static replaceDigestFunction(fn: (req: Request) => RequestStack): void;
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
    static digestRequest: (req: Request) => RequestStack;
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
    private constructor();
    /**
     * [Alias] Requested System
     * ------------------------
     *
     */
    system(): string;
    /**
     * Requested System
     * -----------------
     *
     * Return the requested system name
     * it may or may not exist in the server
     */
    requestedSystem(): string;
    module(): string;
    requestedModule(): string;
    listener(): string;
    action(): string;
    getUrl(): string;
}
