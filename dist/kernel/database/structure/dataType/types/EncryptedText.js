"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class EncryptedText extends DataType_1.DataType {
    constructor() {
        super("EncryptedText");
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
exports.EncryptedText = EncryptedText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW5jcnlwdGVkVGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvZGF0YWJhc2Uvc3RydWN0dXJlL2RhdGFUeXBlL3R5cGVzL0VuY3J5cHRlZFRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBdUM7QUFFdkMsTUFBYSxhQUFjLFNBQVEsbUJBQVE7SUFFdkM7UUFDSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWEsRUFBRSxPQUFxRDtRQUM1RixPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE9BQXFEO1FBQ3ZGLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBVSxFQUFFLE9BQXFEO1FBQzdFLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FFSjtBQWxCRCxzQ0FrQkMifQ==