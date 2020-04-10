"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class Toggle extends DataType_1.DataType {
    constructor() {
        super(Toggle.dataTypeName);
    }
    validate(value) {
        return true;
    }
    parseValueToDatabase(rawValue) {
        return rawValue ? 1 : 0;
    }
    parseValueToUser(dbValue) {
        return dbValue == 0 ? false : true;
    }
}
exports.Toggle = Toggle;
Toggle.dataTypeName = "Toggle";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvZGF0YVR5cGUvdHlwZXMvVG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXVDO0FBRXZDLE1BQWEsTUFBTyxTQUFRLG1CQUFRO0lBSWhDO1FBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sUUFBUSxDQUFDLEtBQVU7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWE7UUFDckMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFZO1FBQ2hDLE9BQU8sT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdkMsQ0FBQzs7QUFsQkwsd0JBb0JDO0FBbEJpQixtQkFBWSxHQUFZLFFBQVEsQ0FBQyJ9