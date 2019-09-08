import { DataTypeContext } from "./DataTypeContext";
export declare abstract class DataType {
    /**
     * Name
     * -----
     *
     */
    protected name: string;
    /**
     * Raw Type
     * ---------
     *
     * Raw SQL Type
     */
    rawType: string;
    constructor(name: string);
    /**
     * Name
     * ------
     *
     * Return the data type name
     */
    getName(): string;
    asJSON(): {
        [prop: string]: any;
    };
    abstract parseValueToDatabase(rawValue: any, context: DataTypeContext): any;
    abstract parseValueToUser(dbValue: any, context: DataTypeContext): any;
    abstract validate(value: any, context: DataTypeContext): boolean;
}
