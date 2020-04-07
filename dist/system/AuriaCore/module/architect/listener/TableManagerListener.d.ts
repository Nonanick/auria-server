import { ModuleListener } from "../../../../../kernel/module/ModuleListener";
import { Table } from "../../../../../kernel/database/structure/table/Table";
import { AuriaConnection } from "../../../../../kernel/database/connection/AuriaConnection";
import { SystemUser } from "../../../../../kernel/security/SystemUser";
import { AuriaArchitect } from "../AuriaArchitect";
import { DatabaseSychronizer } from "../databaseManipulation/DatabaseSynchronizer";
import { ListenerActionsMetadata, ListenerAction } from "../../../../../kernel/module/ListenerAction";
export declare class TableManagerListener extends ModuleListener {
    private dbSync;
    constructor(module: AuriaArchitect);
    getExposedActionsMetadata(): ListenerActionsMetadata;
    protected getDatabaseSynchronizer(conn: number): DatabaseSychronizer;
    situation: ListenerAction;
    databaseSync: ListenerAction;
    protected syncComparissonWithAuria(user: SystemUser, table: Table, comparisson: ColumnComparisson): void;
    private createColumnFromComparisson;
    rawTypeToDataType(type: string): string;
    toCamelCase(str: string, join?: string): string;
    protected syncColumnWithComparisson(user: SystemUser, table: Table, comparisson: ColumnComparisson): Promise<void>;
    protected fetchTableDescription(conn: AuriaConnection, table: string): Promise<any>;
    protected compareColumnDescripion(description: DescribeTableResult, table: Table): ColumnComparisson;
}
declare type DescribeTableResult = {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string;
    Extra: string;
};
declare type ColumnComparisson = {
    status: "sync" | "new" | "unsynced";
    outOfSync?: {
        field: string;
        type?: string;
        key?: string;
        defaultValue?: string;
        nullable?: boolean;
    };
};
export {};
