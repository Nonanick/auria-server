import { DataType } from "../DataType";
import { DataTypeContext } from "../DataTypeContext";

export class NumericIdentifier extends DataType {

    public static dataTypeName : string = "NumericIdentifier";

    constructor() {
        super(NumericIdentifier.dataTypeName);
    }

    public parseValueToDatabase(rawValue: any, context : DataTypeContext) {
        if (this.validate(rawValue, context)) {
            return Number.parseInt(rawValue);
        } else {
            throw new Error("[NumericIdentifier] Value given is not valid for a numeric identifier!");
        }
    }

    public parseValueToUser(dbValue: any, context : DataTypeContext) {
        return dbValue;
    }

    public validate(value: any, context : DataTypeContext): boolean {
        if (!Number.isInteger(value)) {
            return false;
        }
        let number: number = Number.parseInt(value);
        if (number <= 0) {
            return false;
        }
        return true;
    }
} 