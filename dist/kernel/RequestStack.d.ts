export declare class RequestStack {
    protected url: string;
    protected systemName: string;
    protected moduleName: string;
    protected listenerName: string;
    protected actionName: string;
    static digestURL: (url: string) => RequestStack;
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
