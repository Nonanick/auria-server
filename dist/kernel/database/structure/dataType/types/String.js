"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
const util_1 = require("util");
class String extends DataType_1.DataType {
    constructor() {
        super("String");
    }
    parseValueToDatabase(rawValue, context) {
        return (rawValue + "").trim();
    }
    parseValueToUser(dbValue, context) {
        return (dbValue + "").trim();
    }
    validate(value, context) {
        return util_1.isString(value);
    }
}
exports.String = String;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvZGF0YVR5cGUvdHlwZXMvU3RyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBQ3ZDLCtCQUFnQztBQUVoQyxNQUFhLE1BQU8sU0FBUSxtQkFBUTtJQUVoQztRQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRU0sb0JBQW9CLENBQUMsUUFBYSxFQUFFLE9BQXFEO1FBQzVGLE9BQU8sQ0FBQyxRQUFRLEdBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUFxRDtRQUN2RixPQUFPLENBQUMsT0FBTyxHQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBVSxFQUFFLE9BQXFEO1FBQzdFLE9BQU8sZUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQWpCRCx3QkFpQkMifQ==