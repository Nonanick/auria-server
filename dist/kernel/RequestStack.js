"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestStack {
    system() {
        return this.systemName;
    }
    module() {
        return this.moduleName;
    }
    listener() {
        return this.listenerName;
    }
    action() {
        return this.actionName;
    }
}
RequestStack.digestURL = (url) => {
    let stack = new RequestStack();
    let urlPieces = url.split('/');
    let system = urlPieces[1] != null ? urlPieces[1] : "";
    let moduleName = urlPieces[2] != null ? urlPieces[2] : "";
    let listener = urlPieces[3] != null ? urlPieces[3] : "";
    let action = urlPieces[4] != null ? urlPieces[4] : "default";
    stack.systemName = system;
    stack.moduleName = moduleName;
    stack.listenerName = listener;
    stack.actionName = action;
    return stack;
};
exports.RequestStack = RequestStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2tlcm5lbC9SZXF1ZXN0U3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFhLFlBQVk7SUErQmQsTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM3QixDQUFDO0lBRU0sTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDOztBQWpDYSxzQkFBUyxHQUFrQyxDQUFDLEdBQVcsRUFBRSxFQUFFO0lBRXJFLElBQUksS0FBSyxHQUFpQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBRTdDLElBQUksU0FBUyxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFekMsSUFBSSxNQUFNLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUQsSUFBSSxVQUFVLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEUsSUFBSSxRQUFRLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDaEUsSUFBSSxNQUFNLEdBQVcsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFFckUsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFDMUIsS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDOUIsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDOUIsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFFMUIsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFBO0FBN0JMLG9DQStDQyJ9