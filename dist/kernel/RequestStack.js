/**
 * Request Stack
 * --------------
 */
let RequestStack = /** @class */ (() => {
    class RequestStack {
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
        constructor() {
        }
        /**
         * Replace Digest Function
         * -------------------------
         *
         * Modifies how the Request should be digested
         * It affects ALL systems in the AuriaServer!
         *
         * @param fn
         */
        static replaceDigestFunction(fn) {
            RequestStack.digestRequest = fn;
        }
        /**
         * [Alias] Requested System
         * ------------------------
         *
         */
        system() {
            return this.systemName;
        }
        /**
         * Requested System
         * -----------------
         *
         * Return the requested system name
         * it may or may not exist in the server
         */
        requestedSystem() {
            return this.systemName;
        }
        module() {
            return this.moduleName;
        }
        requestedModule() {
            return this.moduleName;
        }
        listener() {
            return this.listenerName;
        }
        action() {
            return this.actionName;
        }
        getUrl() {
            return this.url;
        }
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
    RequestStack.digestRequest = (req) => {
        let stack = new RequestStack();
        let urlPieces = req.path.split('/');
        let system = urlPieces[1] != null ? urlPieces[1] : "";
        let moduleName = urlPieces[2] != null ? urlPieces[2] : "";
        let listener = urlPieces[3] != null ? urlPieces[3] : "";
        let action = urlPieces[4] != null ? urlPieces[4] : "default";
        stack.url = req.originalUrl;
        stack.systemName = system;
        stack.moduleName = moduleName;
        stack.listenerName = listener;
        stack.actionName = action;
        return stack;
    };
    return RequestStack;
})();
export { RequestStack };
//# sourceMappingURL=RequestStack.js.map