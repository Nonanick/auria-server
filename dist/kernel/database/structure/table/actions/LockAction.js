"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TableAction_1 = require("../TableAction");
class LockAction extends TableAction_1.TableAction {
    constructor(table) {
        super(LockAction.ActionName, table);
    }
    apply() {
        throw new Error("Method not implemented.");
    }
}
exports.LockAction = LockAction;
LockAction.ActionName = "lock";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9ja0FjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvc3RydWN0dXJlL3RhYmxlL2FjdGlvbnMvTG9ja0FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUE2QztBQUc3QyxNQUFhLFVBQVcsU0FBUSx5QkFBVztJQUl2QyxZQUFZLEtBQWE7UUFDckIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLEtBQUs7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQzs7QUFWTCxnQ0FXQztBQVRpQixxQkFBVSxHQUFZLE1BQU0sQ0FBQyJ9