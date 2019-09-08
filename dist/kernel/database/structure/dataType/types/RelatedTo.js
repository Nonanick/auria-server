"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class RelatedTo extends DataType_1.DataType {
    constructor() {
        super("RelatedTo");
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
exports.RelatedTo = RelatedTo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsYXRlZFRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvZGF0YVR5cGUvdHlwZXMvUmVsYXRlZFRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBRXZDLE1BQWEsU0FBVSxTQUFRLG1CQUFRO0lBRW5DO1FBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxRQUFhLEVBQUUsT0FBcUQ7UUFDN0YsT0FBTyxRQUFRLENBQUM7SUFDbkIsQ0FBQztJQUVNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUFxRDtRQUN2RixPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU0sUUFBUSxDQUFDLEtBQVUsRUFBRSxPQUFxRDtRQUM3RSxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBR0o7QUFuQkQsOEJBbUJDIn0=