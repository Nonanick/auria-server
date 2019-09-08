"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class ReferenceText extends DataType_1.DataType {
    constructor() {
        super("ReferenceText");
    }
    parseValueToDatabase(rawValue, context) {
        return rawValue;
    }
    parseValueToUser(dbValue, context) {
        return dbValue;
    }
    validate(value, context) {
        return true;
    }
}
exports.ReferenceText = ReferenceText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVmZXJlbmNlVGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvc3RydWN0dXJlL2RhdGFUeXBlL3R5cGVzL1JlZmVyZW5jZVRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBdUM7QUFFdkMsTUFBYSxhQUFjLFNBQVEsbUJBQVE7SUFDdkM7UUFDSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWEsRUFBRSxPQUFxRDtRQUM1RixPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBQ00sZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE9BQXFEO1FBQ3ZGLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTSxRQUFRLENBQUMsS0FBVSxFQUFFLE9BQXFEO1FBQzdFLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQWRELHNDQWNDIn0=