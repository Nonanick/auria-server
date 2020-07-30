export interface ModulePageRowData {
    _id : number;
    module_id : number;
    parent_menu? : number;
    name : string;
    title : string;
    description : string;
    engine : string;
    icon : string;
    url : string;
    data_requirements : any;
    api_requirements : any;
    resource_binding? : string;
    module_binding? : string;
}