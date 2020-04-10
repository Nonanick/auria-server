"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleRequestFactory {
    static setFactoryFunction(fn) {
        ModuleRequestFactory.factoryFn = fn;
    }
    static make(request, user, module) {
        return ModuleRequestFactory.factoryFn(request, user, module);
    }
}
exports.ModuleRequestFactory = ModuleRequestFactory;
ModuleRequestFactory.factoryFn = (request, user, module) => {
    return Object.assign({
        getUser: () => user,
        getModule: () => module
    }, request);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvaHR0cC9yZXF1ZXN0L01vZHVsZVJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxNQUFhLG9CQUFvQjtJQUV0QixNQUFNLENBQUMsa0JBQWtCLENBQUMsRUFBZ0M7UUFFN0Qsb0JBQW9CLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUV4QyxDQUFDO0lBWU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFzQixFQUFFLElBQWdCLEVBQUUsTUFBYztRQUN2RSxPQUFPLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7O0FBcEJMLG9EQXFCQztBQWJrQiw4QkFBUyxHQUFpQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDL0UsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUNoQjtRQUNJLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ25CLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNO0tBQzFCLEVBQ0QsT0FBTyxDQUNWLENBQUM7QUFDTixDQUFDLENBQUMifQ==