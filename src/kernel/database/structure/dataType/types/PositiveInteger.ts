import { DataType } from "../DataType";

export class PositiveInteger extends DataType {


    constructor() {
        super("PositiveInteger");
    }
    
    public parseValueToDatabase(rawValue: any) {
        if (this.validate(rawValue)) {
            return Number.parseInt(rawValue);
        } else {
            throw new Error("[PositiveInteger] Value given is not a positive integer or 0!");
        }
    }

    public parseValueToUser(dbValue: any) {
        return dbValue;
    }

    public validate(value: any): boolean {
        if (!Number.isInteger(value)) {
            return false;
        }
        let number: number = Number.parseInt(value);
        if (number < 0) {
            return false;
        }
        return true;
    }


}