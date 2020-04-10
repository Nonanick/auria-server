"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Request Stack
 * --------------
 */
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
exports.RequestStack = RequestStack;
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
    let urlPieces = req.url.split('/');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9SZXF1ZXN0U3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7O0dBR0c7QUFDSCxNQUFhLFlBQVk7SUFtRnJCOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSDtJQUVBLENBQUM7SUE5REQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsRUFBb0M7UUFDcEUsWUFBWSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQXFERDs7OztPQUlHO0lBQ0ksTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0ksZUFBZTtRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLGVBQWU7UUFDbEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFTSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7O0FBMUlMLG9DQTRJQztBQTFGRzs7Ozs7Ozs7Ozs7R0FXRztBQUNXLDBCQUFhLEdBQW1DLENBQUMsR0FBWSxFQUFFLEVBQUU7SUFFM0UsSUFBSSxLQUFLLEdBQWlCLElBQUksWUFBWSxFQUFFLENBQUM7SUFFN0MsSUFBSSxTQUFTLEdBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFN0MsSUFBSSxNQUFNLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUQsSUFBSSxVQUFVLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEUsSUFBSSxRQUFRLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDaEUsSUFBSSxNQUFNLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFFckUsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBRTVCLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBRTFCLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQSJ9