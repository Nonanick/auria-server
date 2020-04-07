import { DataFilter } from "aurialib2/data/filter/DataFilter";

export interface DataDependency {
    name : string;
    customFilters? : DataFilter[];
    dataActions? : string[];
}