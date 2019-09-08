"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccessManager {
    constructor(system) {
        this.system = system;
    }
    setUser(user) {
        this.user = user;
    }
    getModule() {
        return this.module;
    }
    getListener() {
        return this.listener;
    }
    getListenerAction() {
        return this.action;
    }
    loadRequestStack(request) {
        if (!this.system.hasModule(request.getModuleName())) {
            throw new Error("Module does not exist in this system!");
        }
        let mod = this.system.getModule(request.getModuleName());
        if (mod != null) {
            this.module = mod;
            if (!mod.hasListener(request.getListenerName()) && !mod.hasListener(request.getListenerName() + "Listener")) {
                throw new Error("Listener does not exist in this module");
            }
            let list = mod.getListener(request.getListenerName()) == null ?
                mod.getListener(request.getListenerName() + "Listener") :
                mod.getListener(request.getListenerName());
            if (list == null) {
                throw new Error("Listener unavaliable in this module");
            }
            this.listener = list;
            console.log("Listener have action?", request.getActionName(), list.hasOwnProperty(request.getActionName()));
            if (list.hasOwnProperty(request.getActionName())) {
                let fn = list[request.getActionName()];
                this.action = fn;
            }
            else {
                throw new Error("This action is not exposed by this listener!");
            }
        }
        else {
            throw new Error("Module is not avaliable in this system");
        }
    }
}
exports.AccessManager = AccessManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNjZXNzTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvc2VjdXJpdHkvQWNjZXNzTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLE1BQXNCLGFBQWE7SUFZL0IsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxPQUFPLENBQUMsSUFBZ0I7UUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVNLFdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVNLGlCQUFpQjtRQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQU1NLGdCQUFnQixDQUFDLE9BQXFCO1FBRXpDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRTtZQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFFYixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFO2dCQUN6RyxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUMzRCxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBRS9DLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7YUFDMUQ7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFNUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFO2dCQUM5QyxJQUFJLEVBQUUsR0FBSSxJQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQzthQUNuRTtTQUNKO2FBQU07WUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDN0Q7SUFDTCxDQUFDO0NBR0o7QUExRUQsc0NBMEVDIn0=