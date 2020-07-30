export interface ResourceAccessShareRowData {
    _id : number;
    resource_id : number;
    resource_row_id : string;
    user_authority? : number;
    role_authority? : number;
    shared_used_id? : number;
    shared_role_id? : number;
    data_procedure : string;
    
}