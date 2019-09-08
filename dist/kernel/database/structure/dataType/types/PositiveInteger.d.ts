import { DataType } from "../DataType";
export declare class PositiveInteger extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any): number;
    parseValueToUser(dbValue: any): any;
    validate(value: any): boolean;
}
