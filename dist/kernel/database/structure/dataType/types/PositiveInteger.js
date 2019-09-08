"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class PositiveInteger extends DataType_1.DataType {
    constructor() {
        super("PositiveInteger");
    }
    parseValueToDatabase(rawValue) {
        if (this.validate(rawValue)) {
            return Number.parseInt(rawValue);
        }
        else {
            throw new Error("[PositiveInteger] Value given is not a positive integer or 0!");
        }
    }
    parseValueToUser(dbValue) {
        return dbValue;
    }
    validate(value) {
        if (!Number.isInteger(value)) {
            return false;
        }
        let number = Number.parseInt(value);
        if (number < 0) {
            return false;
        }
        return true;
    }
}
exports.PositiveInteger = PositiveInteger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zaXRpdmVJbnRlZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvZGF0YVR5cGUvdHlwZXMvUG9zaXRpdmVJbnRlZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBRXZDLE1BQWEsZUFBZ0IsU0FBUSxtQkFBUTtJQUd6QztRQUNJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxRQUFhO1FBQ3JDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUNwRjtJQUNMLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFZO1FBQ2hDLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBVTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBR0o7QUEvQkQsMENBK0JDIn0=