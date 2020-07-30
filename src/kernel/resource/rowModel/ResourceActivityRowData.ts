export interface ResourceActivityRowData {
    _id : number;
    resource_id : number;
    resource_row_id : string;
    user_id : number;
    role_authority? : number;
    user_authority? : number;
    data_procedure : string;
    extra_information? : any;
}