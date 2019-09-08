import { DataType } from "../DataType";
export declare class Number extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext): number;
    parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext): number;
    validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean;
}
