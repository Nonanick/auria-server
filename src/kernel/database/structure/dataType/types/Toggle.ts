import { DataType } from "../DataType";

export class Toggle extends DataType {

    public static dataTypeName : string = "Toggle";

    constructor() {
        super(Toggle.dataTypeName);
    }

    public validate(value: any): boolean {
        return true;
    }

    public parseValueToDatabase(rawValue: any) {
        return rawValue ? 1 : 0;
    }
    
    public parseValueToUser(dbValue: any) {
        return dbValue == 0 ? false : true;
    }
    
}