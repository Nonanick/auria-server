import { DataType } from "../DataType";
import { DataTypeContext } from "../DataTypeContext";

export class TableSourceType extends DataType {

    constructor() {
        super("TableSource");
    }
    
    public parseValueToDatabase(rawValue: any, context: DataTypeContext) {
        throw new Error("Method not implemented.");
    }    
    
    public parseValueToUser(dbValue: any, context: DataTypeContext) {
        throw new Error("Method not implemented.");
    }
    
    public validate(value: any, context: DataTypeContext): boolean {
        throw new Error("Method not implemented.");
    }

    
}