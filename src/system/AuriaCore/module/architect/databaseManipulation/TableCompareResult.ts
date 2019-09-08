import { ConnectionTableDefinition } from "./definitions/ConnectionTableDefinition";
import { ConnectionColumnDefinition } from "./definitions/ConnectionColumnDefinition";

export type TableSyncSituation = "onlyInConnection" | "onlyInAuria" | "unsynced" | "synced";

export type ColumnSyncSituation = "synced" | "unsynced" | "onlyInAuria" | "onlyInConnection";

export class TableCompareResult {

    public tableSituation : TableSyncSituation;

    public auriaTable : ConnectionTableDefinition | undefined;
    
    public connTable : ConnectionTableDefinition | undefined;

    public columns : {
        [columnName : string] : {
            situation? : ColumnSyncSituation;
            auria? : ConnectionColumnDefinition;
            db? : ConnectionColumnDefinition;
        }
    } = {};

    public asJson() {
        
        return {
            situation : this.tableSituation,
            columns : this.columns
        };
    }
}