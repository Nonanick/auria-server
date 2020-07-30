export interface ModuleMenuRowData {
    _id : number;
    module_id : number;
    parent_menu_id? : number;
    name : string;
    title : string;
    description : string;
    icon : string;
    color : string;
    url : string;
}