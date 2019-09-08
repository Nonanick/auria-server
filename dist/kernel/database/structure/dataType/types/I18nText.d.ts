import { DataType } from "../DataType";
export declare class I18nText extends DataType {
    parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext): any;
    parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext): any;
    validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean;
    constructor();
}
