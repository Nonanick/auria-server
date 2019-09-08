import { DataType } from "../DataType";
import { DataTypeContext } from "../DataTypeContext";
export declare class TableSourceType extends DataType {
    constructor();
    parseValueToDatabase(rawValue: any, context: DataTypeContext): void;
    parseValueToUser(dbValue: any, context: DataTypeContext): void;
    validate(value: any, context: DataTypeContext): boolean;
}
