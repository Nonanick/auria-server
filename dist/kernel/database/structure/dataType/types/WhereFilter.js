"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class WhereFilter extends DataType_1.DataType {
    constructor() {
        super("WhereFilter");
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
exports.WhereFilter = WhereFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2hlcmVGaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9kYXRhVHlwZS90eXBlcy9XaGVyZUZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUV2QyxNQUFhLFdBQVksU0FBUSxtQkFBUTtJQUVyQztRQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU0sb0JBQW9CLENBQUMsUUFBYSxFQUFFLE9BQXFEO1FBQzVGLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFDTSxnQkFBZ0IsQ0FBQyxPQUFZLEVBQUUsT0FBcUQ7UUFDdkYsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNNLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBcUQ7UUFDN0UsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBZkQsa0NBZUMifQ==