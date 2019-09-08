"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class RowTitle extends DataType_1.DataType {
    constructor() {
        super("RowTitle");
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
exports.RowTitle = RowTitle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93VGl0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9kYXRhVHlwZS90eXBlcy9Sb3dUaXRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUd2QyxNQUFhLFFBQVMsU0FBUSxtQkFBUTtJQUVsQztRQUNJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRU0sb0JBQW9CLENBQUMsUUFBYSxFQUFFLE9BQXdCO1FBQy9ELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFZLEVBQUUsT0FBd0I7UUFDMUQsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBd0I7UUFDaEQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUdKO0FBbkJELDRCQW1CQyJ9