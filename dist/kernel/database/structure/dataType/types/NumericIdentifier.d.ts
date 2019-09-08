import { DataType } from "../DataType";
import { DataTypeContext } from "../DataTypeContext";
export declare class NumericIdentifier extends DataType {
    static dataTypeName: string;
    constructor();
    parseValueToDatabase(rawValue: any, context: DataTypeContext): number;
    parseValueToUser(dbValue: any, context: DataTypeContext): any;
    validate(value: any, context: DataTypeContext): boolean;
}
