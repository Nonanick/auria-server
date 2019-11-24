"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class ModulePage extends events_1.EventEmitter {
    constructor(module) {
        super();
        this.module = module;
    }
    getModule() {
        return this.module;
    }
    getRequiredDataAccess() {
    }
    getRequiredApiAccess() {
    }
}
exports.ModulePage = ModulePage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kdWxlUGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL3BhZ2UvTW9kdWxlUGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUd0QyxNQUFhLFVBQVcsU0FBUSxxQkFBWTtJQUl4QyxZQUFZLE1BQWU7UUFDdkIsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRU0sU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0scUJBQXFCO0lBRTVCLENBQUM7SUFFTSxvQkFBb0I7SUFFM0IsQ0FBQztDQUVKO0FBdEJELGdDQXNCQyJ9