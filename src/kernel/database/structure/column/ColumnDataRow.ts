import { SQLType } from "../../../../system/AuriaCore/module/architect/databaseManipulation/definitions/ConnectionColumnDefinition";

export interface ColumnDataRow {
    name : string;
    attributes: string;
    title : string;
    description : string;
    column : string;
    data_type : string;
    table_type : string;
    sql_type : SQLType;
    length : number;
    extra : string;
    default_value : string;
    nullable : "YES"|"NO";
}