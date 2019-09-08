import { Table } from "../table/Table";
import { System } from "../../../System";
import { Column } from "../column/Column";

export interface DataTypeContext {
    system : System;
    table : Table;
    column : Column;
    
}