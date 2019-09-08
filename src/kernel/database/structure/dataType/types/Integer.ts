import { DataType } from "../DataType";

export class Integer extends DataType {
    
    constructor() {
        super("Integer");
    }

    public parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return parseInt(rawValue);
    }
    public parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return dbValue;
    }
    public validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean {
        return Number.isInteger(value);
    }
    
}