import { DataType } from "../DataType";
export declare class String extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext): string;
    parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext): string;
    validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean;
}
