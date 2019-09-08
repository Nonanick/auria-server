"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class NumericIdentifier extends DataType_1.DataType {
    constructor() {
        super(NumericIdentifier.dataTypeName);
    }
    parseValueToDatabase(rawValue, context) {
        if (this.validate(rawValue, context)) {
            return Number.parseInt(rawValue);
        }
        else {
            throw new Error("[NumericIdentifier] Value given is not valid for a numeric identifier!");
        }
    }
    parseValueToUser(dbValue, context) {
        return dbValue;
    }
    validate(value, context) {
        if (!Number.isInteger(value)) {
            return false;
        }
        let number = Number.parseInt(value);
        if (number <= 0) {
            return false;
        }
        return true;
    }
}
NumericIdentifier.dataTypeName = "NumericIdentifier";
exports.NumericIdentifier = NumericIdentifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtZXJpY0lkZW50aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9kYXRhVHlwZS90eXBlcy9OdW1lcmljSWRlbnRpZmllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUd2QyxNQUFhLGlCQUFrQixTQUFRLG1CQUFRO0lBSTNDO1FBQ0ksS0FBSyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxRQUFhLEVBQUUsT0FBeUI7UUFDaEUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNsQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsd0VBQXdFLENBQUMsQ0FBQztTQUM3RjtJQUNMLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFZLEVBQUUsT0FBeUI7UUFDM0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBeUI7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNiLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7QUEzQmEsOEJBQVksR0FBWSxtQkFBbUIsQ0FBQztBQUY5RCw4Q0E4QkMifQ==