"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
const util_1 = require("util");
class Number extends DataType_1.DataType {
    constructor() {
        super("Number");
    }
    parseValueToDatabase(rawValue, context) {
        return parseFloat(rawValue);
    }
    parseValueToUser(dbValue, context) {
        return parseFloat(dbValue);
    }
    validate(value, context) {
        return util_1.isNumber(value);
    }
}
exports.Number = Number;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvZGF0YVR5cGUvdHlwZXMvTnVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBQ3ZDLCtCQUFnQztBQUVoQyxNQUFhLE1BQU8sU0FBUSxtQkFBUTtJQUVoQztRQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRU0sb0JBQW9CLENBQUMsUUFBYSxFQUFFLE9BQXFEO1FBQzdGLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDTSxnQkFBZ0IsQ0FBQyxPQUFZLEVBQUUsT0FBcUQ7UUFDdkYsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNNLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBcUQ7UUFDN0UsT0FBTyxlQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBZkQsd0JBZUMifQ==