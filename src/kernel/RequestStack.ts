export class RequestStack {

    protected url: string;

    protected systemName: string;

    protected moduleName: string;

    protected listenerName: string;

    protected actionName: string;

    public static digestURL: (url: string) => RequestStack = (url: string) => {

        let stack: RequestStack = new RequestStack();

        let urlPieces: string[] = url.split('/');

        let system: string = urlPieces[1] != null ? urlPieces[1] : "";
        let moduleName: string = urlPieces[2] != null ? urlPieces[2] : "";
        let listener: string = urlPieces[3] != null ? urlPieces[3] : "";
        let action: string = urlPieces[4] != null ? urlPieces[4] : "default";

        stack.url = url;

        stack.systemName = system;
        stack.moduleName = moduleName;
        stack.listenerName = listener;
        stack.actionName = action;

        return stack;
    }

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