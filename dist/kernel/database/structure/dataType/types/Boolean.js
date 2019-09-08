"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class Boolean extends DataType_1.DataType {
    constructor() {
        super("Boolean");
    }
    parseValueToDatabase(rawValue, context) {
        return rawValue ? 1 : 0;
    }
    parseValueToUser(dbValue, context) {
        return dbValue ? true : false;
    }
    validate(value, context) {
        return true;
    }
}
exports.Boolean = Boolean;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbGVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvc3RydWN0dXJlL2RhdGFUeXBlL3R5cGVzL0Jvb2xlYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBdUM7QUFFdkMsTUFBYSxPQUFRLFNBQVEsbUJBQVE7SUFFakM7UUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWEsRUFBRSxPQUFxRDtRQUM3RixPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUFxRDtRQUN2RixPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUNNLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBcUQ7UUFDN0UsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUdKO0FBakJELDBCQWlCQyJ9