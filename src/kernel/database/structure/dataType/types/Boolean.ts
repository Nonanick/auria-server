import { DataType } from "../DataType";

export class Boolean extends DataType {
 
    constructor() {
        super("Boolean");
    }

    public parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext) {
       return rawValue ? 1 : 0;
    }
    public parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return dbValue ? true : false;
    }
    public validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean {
        return true;
    }
    

}