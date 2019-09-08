import { DataType } from "../DataType";
import { isString } from "util";

export class String extends DataType {
    
    constructor() {
        super("String");
    }
    
    public parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return (rawValue+"").trim();
    }
    
    public parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return (dbValue+"").trim();
    }

    public validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean {
        return isString(value);
    }
}