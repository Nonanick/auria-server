export declare class ConnectionColumnDefinition {
    protected name: string;
    protected sqlType: SQLType;
    length: number;
    default: string;
    isPrimary: boolean;
    null: string;
    extra: string;
    key: string;
    constructor(name: string);
    getName(): string;
    setSQLType(sqlType: SQLType, skipAutoSet?: boolean): void;
    setExtra(extra: string): this;
    setKey(key: string): this;
    asJson(): {
        name: string;
        sqlType: SQLType;
        length: number;
        default: string;
        primary: boolean;
        null: string;
    };
}
export declare type SQLType = "tinyint" | "boolean" | "smallint" | "mediumint" | "int" | "integer" | "bigint" | "decimal" | "float" | "double" | "bit" | "date" | "time" | "datetime" | "timestamp" | "year" | "char" | "varchar" | "binary" | "varbinary" | "tinyblob" | "blob" | "mediumblob" | "longblob" | "tinytext" | "text" | "mediumtext" | "longtext" | "enum" | "set";
