import Knex from "knex";
import { SQLTypes } from "./SQLTypes";

export abstract class EntityColumn {

    public name: string;

    public title : string;

    public columnName: string;

    public sqlType: SQLTypes;

    public length: number;

    public defaultValue : any;

    protected primaryKey: boolean = false;
    protected index: boolean = false;
    protected foreignKey: boolean = false;
    protected unsigned : boolean = false;
    protected unique : boolean = false;

    constructor(name: string) {
        this.name = name;
    }

    public abstract buildSchema(builder: Knex.CreateTableBuilder);

    public isPrimaryKey(): boolean {
        return this.primaryKey;
    }

    public isIndexKey(): boolean {
        return this.index;
    }

    public isForeignKey(): boolean {
        return this.foreignKey;
    }

    public isUnsigned() : boolean {
        return this.unsigned;
    }
}