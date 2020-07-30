export interface ColumnRowData {
    name : string;
    title : string;
    resource_id : number;
    column_name : string;
    data_type : string;
    order: number;
    nullable : boolean;
    keys? : ("PRI"|"IND"|"UNI")[],
    comment? : string;
    length? : number;
    reference? : {
        schema?: string;
        table : string;
        column : string;
    };


}