"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestStack {
    constructor() {
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
RequestStack.digestURL = (url) => {
    let stack = new RequestStack();
    let urlPieces = url.split('/');
    let system = urlPieces[1] != null ? urlPieces[1] : "";
    let moduleName = urlPieces[2] != null ? urlPieces[2] : "";
    let listener = urlPieces[3] != null ? urlPieces[3] : "";
    let action = urlPieces[4] != null ? urlPieces[4] : "default";
    stack.url = url;
    stack.systemName = system;
    stack.moduleName = moduleName;
    stack.listenerName = listener;
    stack.actionName = action;
    return stack;
};
exports.RequestStack = RequestStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9SZXF1ZXN0U3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFhLFlBQVk7SUFpQ3JCO0lBRUEsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSSxlQUFlO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBQ00sZUFBZTtRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDcEIsQ0FBQzs7QUE3RGEsc0JBQVMsR0FBa0MsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUVyRSxJQUFJLEtBQUssR0FBaUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUU3QyxJQUFJLFNBQVMsR0FBYSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXpDLElBQUksTUFBTSxHQUFXLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzlELElBQUksVUFBVSxHQUFXLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2xFLElBQUksUUFBUSxHQUFXLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2hFLElBQUksTUFBTSxHQUFXLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBRXJFLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBRWhCLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBRTFCLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQTtBQS9CTCxvQ0EyRUMifQ==