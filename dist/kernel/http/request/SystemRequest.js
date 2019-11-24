"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemRequestFactory {
    static make(request, system, stack) {
        let serverRequest = Object.assign({
            getSystem: () => system,
            getSystemName: () => system.name,
            getRequestStack: () => stack
        }, request);
        return serverRequest;
    }
}
exports.SystemRequestFactory = SystemRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvaHR0cC9yZXF1ZXN0L1N5c3RlbVJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUEwQ0EsTUFBYSxvQkFBb0I7SUFFdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFnQixFQUFFLE1BQWMsRUFBRSxLQUFvQjtRQUVyRSxJQUFJLGFBQWEsR0FBbUIsTUFBTSxDQUFDLE1BQU0sQ0FDN0M7WUFDSSxTQUFTLEVBQUcsR0FBRyxFQUFFLENBQUMsTUFBTTtZQUN4QixhQUFhLEVBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDakMsZUFBZSxFQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUs7U0FDaEMsRUFDRCxPQUFPLENBQ1YsQ0FBQztRQUVGLE9BQU8sYUFBYSxDQUFDO0lBRXpCLENBQUM7Q0FHSjtBQWxCRCxvREFrQkMifQ==