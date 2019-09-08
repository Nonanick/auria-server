"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class I18nText extends DataType_1.DataType {
    parseValueToDatabase(rawValue, context) {
        return rawValue;
    }
    parseValueToUser(dbValue, context) {
        return dbValue;
    }
    validate(value, context) {
        return true;
    }
    constructor() {
        super("I18nText");
    }
}
exports.I18nText = I18nText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSTE4blRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9kYXRhVHlwZS90eXBlcy9JMThuVGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUV2QyxNQUFhLFFBQVMsU0FBUSxtQkFBUTtJQUUzQixvQkFBb0IsQ0FBQyxRQUFhLEVBQUUsT0FBcUQ7UUFDNUYsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUNNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUFxRDtRQUN2RixPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ00sUUFBUSxDQUFDLEtBQVUsRUFBRSxPQUFxRDtRQUM3RSxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7UUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEIsQ0FBQztDQUNKO0FBZkQsNEJBZUMifQ==