import { DataType } from "../DataType";
export declare class Boolean extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext): 0 | 1;
    parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext): boolean;
    validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean;
}
