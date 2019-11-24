export declare class RequestStack {
    protected url: string;
    protected systemName: string;
    protected moduleName: string;
    protected listenerName: string;
    protected actionName: string;
    static digestURL: (url: string) => RequestStack;
    system(): string;
    module(): string;
    listener(): string;
    action(): string;
}
