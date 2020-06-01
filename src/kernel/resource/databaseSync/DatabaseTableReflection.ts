import { DatabaseColumnReflection } from "./DatabaseColumnReflection.js";

export interface DatabaseTableReflection {
    columns : {
        [columnName : string] : DatabaseColumnReflection
    };
}