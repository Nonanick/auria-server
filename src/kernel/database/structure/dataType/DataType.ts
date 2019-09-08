import { DataTypeContext } from "./DataTypeContext";

export abstract class DataType  {

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
    public rawType: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Name
     * ------
     * 
     * Return the data type name
     */
    public getName(): string {
        return this.name;
    }

    public asJSON(): { [prop: string]: any; } {
        return {
            name: this.name,
            rawType: this.rawType
        };
    }

    public abstract parseValueToDatabase(rawValue : any, context : DataTypeContext) : any;

    public abstract parseValueToUser(dbValue : any, context : DataTypeContext) : any;

    public abstract validate(value : any, context : DataTypeContext) : boolean;
}