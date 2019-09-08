"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class RowDescription extends DataType_1.DataType {
    constructor() {
        super("RowDescription");
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
exports.RowDescription = RowDescription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93RGVzY3JpcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9kYXRhVHlwZS90eXBlcy9Sb3dEZXNjcmlwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUV2QyxNQUFhLGNBQWUsU0FBUSxtQkFBUTtJQUd4QztRQUNJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxRQUFhLEVBQUUsT0FBcUQ7UUFDNUYsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUNNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUFxRDtRQUN2RixPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ00sUUFBUSxDQUFDLEtBQVUsRUFBRSxPQUFxRDtRQUM3RSxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBRUo7QUFqQkQsd0NBaUJDIn0=