export interface ResourceAccessPolicyRowData {
    _id : number;
    resource_id : number;
    user_id? : number;
    role_id? : number;
    resource_row_id : string;
    data_procedure : string;
    
}