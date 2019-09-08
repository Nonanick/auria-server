import { DataType } from "../DataType";
import { DataTypeContext } from "../DataTypeContext";

export class RowTitle extends DataType {

    constructor() {
        super("RowTitle");
    }
    
    public parseValueToDatabase(rawValue: any, context: DataTypeContext) {
        return rawValue;
    }

    public parseValueToUser(dbValue: any, context: DataTypeContext) {
        return dbValue;
    }

    public validate(value: any, context: DataTypeContext) {
        return true;
    }


}