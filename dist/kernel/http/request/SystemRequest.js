"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemRequestFactory {
    constructor() {
        /**
         * Factory function to be used to generate a SystemRequest
         * based on a Express Request object, the system that will
         * be handling the request
         *
         */
        this.factoryFn = (request, system, stack) => {
            let serverRequest = Object.assign({
                getSystem: () => system,
                getSystemName: () => system.name,
                getRequestStack: () => stack
            }, request);
            return serverRequest;
        };
    }
    setFactoryFunction(fn) {
        this.factoryFn = fn;
    }
    make(request, system, stack) {
        return this.factoryFn(request, system, stack);
    }
}
exports.SystemRequestFactory = SystemRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvaHR0cC9yZXF1ZXN0L1N5c3RlbVJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFtREEsTUFBYSxvQkFBb0I7SUFBakM7UUFFSTs7Ozs7V0FLRztRQUNLLGNBQVMsR0FDYixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxhQUFhLEdBQWtCLE1BQU0sQ0FBQyxNQUFNLENBQzVDO2dCQUNJLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNO2dCQUN2QixhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUk7Z0JBQ2hDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLO2FBQy9CLEVBQ0QsT0FBTyxDQUNWLENBQUM7WUFFRixPQUFPLGFBQWEsQ0FBQztRQUN6QixDQUFDLENBQUM7SUFXVixDQUFDO0lBVFUsa0JBQWtCLENBQUMsRUFBZ0M7UUFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFzQixFQUFFLE1BQWMsRUFBRSxLQUFtQjtRQUNuRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBR0o7QUEvQkQsb0RBK0JDIn0=