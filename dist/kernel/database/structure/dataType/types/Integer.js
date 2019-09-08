"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class Integer extends DataType_1.DataType {
    constructor() {
        super("Integer");
    }
    parseValueToDatabase(rawValue, context) {
        return parseInt(rawValue);
    }
    parseValueToUser(dbValue, context) {
        return dbValue;
    }
    validate(value, context) {
        return Number.isInteger(value);
    }
}
exports.Integer = Integer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvc3RydWN0dXJlL2RhdGFUeXBlL3R5cGVzL0ludGVnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBdUM7QUFFdkMsTUFBYSxPQUFRLFNBQVEsbUJBQVE7SUFFakM7UUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWEsRUFBRSxPQUFxRDtRQUM1RixPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ00sZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE9BQXFEO1FBQ3ZGLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTSxRQUFRLENBQUMsS0FBVSxFQUFFLE9BQXFEO1FBQzdFLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBRUo7QUFoQkQsMEJBZ0JDIn0=