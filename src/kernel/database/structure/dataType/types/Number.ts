import { DataType } from "../DataType";
import { isNumber } from "util";

export class Number extends DataType {

    constructor() {
        super("Number");
    }

    public parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext) {
       return parseFloat(rawValue);
    }
    public parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return parseFloat(dbValue);
    }
    public validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean {
        return isNumber(value);
    }
}
