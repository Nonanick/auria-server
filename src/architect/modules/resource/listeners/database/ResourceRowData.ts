import { TranslationsByLang } from "../../../../../kernel/module/Module.js";

export interface ResourceRowData {
    name : string;
    connection_id? : number;
    table_name : string;
    title : string | TranslationsByLang;
    description : string | TranslationsByLang;
    system_table? : boolean;
}

export interface ResourceCreationOptions {
    versioned? : boolean;
    allow_permission_inheritance?: boolean;
}