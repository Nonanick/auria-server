"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class Icon extends DataType_1.DataType {
    constructor() {
        super("Icon");
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
exports.Icon = Icon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvc3RydWN0dXJlL2RhdGFUeXBlL3R5cGVzL0ljb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBdUM7QUFFdkMsTUFBYSxJQUFLLFNBQVEsbUJBQVE7SUFFOUI7UUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWEsRUFBRSxPQUFxRDtRQUM1RixPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBQ00sZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE9BQXFEO1FBQ3ZGLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTSxRQUFRLENBQUMsS0FBVSxFQUFFLE9BQXFEO1FBQzdFLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQWZELG9CQWVDIn0=