import { DataType } from "../DataType";
export declare class Toggle extends DataType {
    static dataTypeName: string;
    constructor();
    validate(value: any): boolean;
    parseValueToDatabase(rawValue: any): 1 | 0;
    parseValueToUser(dbValue: any): boolean;
}
