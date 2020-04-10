import { ConnectionTableDefinition } from "./definitions/ConnectionTableDefinition";
import { ConnectionColumnDefinition } from "./definitions/ConnectionColumnDefinition";
export declare type TableSyncSituation = "onlyInConnection" | "onlyInAuria" | "unsynced" | "synced";
export declare type ColumnSyncSituation = "synced" | "unsynced" | "onlyInAuria" | "onlyInConnection";
export declare class TableCompareResult {
    tableSituation: TableSyncSituation;
    auriaTable: ConnectionTableDefinition | undefined;
    connTable: ConnectionTableDefinition | undefined;
    columns: {
        [columnName: string]: {
            situation?: ColumnSyncSituation;
            auria?: ConnectionColumnDefinition;
            db?: ConnectionColumnDefinition;
        };
    };
    asJson(): {
        situation: TableSyncSituation;
        columns: {
            [columnName: string]: {
                situation?: "onlyInConnection" | "onlyInAuria" | "unsynced" | "synced" | undefined;
                auria?: ConnectionColumnDefinition | undefined;
                db?: ConnectionColumnDefinition | undefined;
            };
        };
    };
}
