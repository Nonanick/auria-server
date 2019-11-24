"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleRequestFactory {
    static make(request, user) {
        return Object.assign({
            getUser: () => user,
        }, request);
    }
}
exports.ModuleRequestFactory = ModuleRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvaHR0cC9yZXF1ZXN0L01vZHVsZVJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFTQSxNQUFhLG9CQUFvQjtJQUV0QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQXNCLEVBQUUsSUFBZ0I7UUFFdkQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1NBQ3RCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFaEIsQ0FBQztDQUNKO0FBVEQsb0RBU0MifQ==