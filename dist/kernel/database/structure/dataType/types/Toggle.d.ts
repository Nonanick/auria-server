import { DataType } from "../DataType";
export declare class Toggle extends DataType {
    static dataTypeName: string;
    constructor();
    validate(value: any): boolean;
    parseValueToDatabase(rawValue: any): 0 | 1;
    parseValueToUser(dbValue: any): boolean;
}
