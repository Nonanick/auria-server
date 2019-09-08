import { DataType } from "../DataType";

export class RelatedTo extends DataType {

    constructor() {
        super("RelatedTo");
    }

    public parseValueToDatabase(rawValue: any, context: import("../DataTypeContext").DataTypeContext) {
       return rawValue;
    }    
    
    public parseValueToUser(dbValue: any, context: import("../DataTypeContext").DataTypeContext) {
        return dbValue;
    }
    
    public validate(value: any, context: import("../DataTypeContext").DataTypeContext): boolean {
        return true;
    }

    
}