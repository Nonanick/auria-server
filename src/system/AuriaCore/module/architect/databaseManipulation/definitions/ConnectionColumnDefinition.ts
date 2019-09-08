export class ConnectionColumnDefinition {

    protected name: string;

    protected sqlType: SQLType;

    public length: number;

    public default: string;

    public isPrimary: boolean;

    public null: string;

    public extra : string;

    public key : string;

    constructor(name: string) {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public setSQLType(sqlType: SQLType, skipAutoSet = false) {

        this.sqlType = sqlType;
        
        let type = sqlType.toLocaleLowerCase();
        
        if(type.indexOf('(') >= 0 && !skipAutoSet) {
            this.sqlType = sqlType.slice(0, type.indexOf('(')) as SQLType;

            let matches = type.match(/[(][^)]*\)/g);
            if(matches != null){
                matches.forEach((number)=> {
                    this.length = Number.parseInt(number.slice(1, -1));
                });
            }
        }        
    }

    public setExtra(extra: string) {
        this.extra = extra;
        return this;
    }

    public setKey(key: string) {
        if(key.toLocaleUpperCase().indexOf("PRI") >= 0) {
            this.isPrimary = true;
        }
        return this;
    }

    public asJson() {
        return {
            name: this.name,
            sqlType: this.sqlType,
            length: this.length,
            default: this.default,
            primary: this.isPrimary,
            null: this.null
        };
    }
}

export type SQLType =
    // # - Numeric
    "tinyint" | "boolean" | "smallint" | "mediumint" | "int" | "integer" | "bigint" | "decimal" | "float" | "double" | "bit" |
    // # - Date
    "date" | "time" | "datetime" | "timestamp" | "year" |
    // # - String
    "char" | "varchar" | "binary" | "varbinary" | "tinyblob" | "blob" | "mediumblob" | "longblob" | "tinytext" | "text" | "mediumtext" | "longtext" | "enum" | "set";