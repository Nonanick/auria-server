import { DataType } from "../DataType";
import { DataTypeContext } from "../DataTypeContext";
export declare class RowTitle extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any, context: DataTypeContext): any;
    parseValueToUser(dbValue: any, context: DataTypeContext): any;
    validate(value: any, context: DataTypeContext): boolean;
}
