"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class Timestamp extends DataType_1.DataType {
    constructor() {
        super("Timestamp");
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
exports.Timestamp = Timestamp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZXN0YW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvZGF0YVR5cGUvdHlwZXMvVGltZXN0YW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBRXZDLE1BQWEsU0FBVSxTQUFRLG1CQUFRO0lBRW5DO1FBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxRQUFhLEVBQUUsT0FBcUQ7UUFDNUYsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUNNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUFxRDtRQUN2RixPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ00sUUFBUSxDQUFDLEtBQVUsRUFBRSxPQUFxRDtRQUM3RSxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBRUo7QUFoQkQsOEJBZ0JDIn0=