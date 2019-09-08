"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
class TableSourceType extends DataType_1.DataType {
    constructor() {
        super("TableSource");
    }
    parseValueToDatabase(rawValue, context) {
        throw new Error("Method not implemented.");
    }
    parseValueToUser(dbValue, context) {
        throw new Error("Method not implemented.");
    }
    validate(value, context) {
        throw new Error("Method not implemented.");
    }
}
exports.TableSourceType = TableSourceType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVTb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9kYXRhVHlwZS90eXBlcy9UYWJsZVNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUd2QyxNQUFhLGVBQWdCLFNBQVEsbUJBQVE7SUFFekM7UUFDSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFFBQWEsRUFBRSxPQUF3QjtRQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLGdCQUFnQixDQUFDLE9BQVksRUFBRSxPQUF3QjtRQUMxRCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBd0I7UUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FHSjtBQW5CRCwwQ0FtQkMifQ==