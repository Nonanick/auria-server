import { DataType } from "../DataType";
export declare class Integer extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext): number;
    parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext): any;
    validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean;
}
