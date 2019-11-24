import { ModuleListener, ListenerActionsDefinition, ListenerAction } from "../../../../../kernel/module/ModuleListener";
import { AuriaRequest } from "../../../../../kernel/http/AuriaRequest";
import { AuriaResponse } from "../../../../../kernel/http/AuriaResponse";
import { AuriaMiddleware } from "../../../../../kernel/http/AuriaMiddleware";
import { AuriaArchitect } from "../AuriaArchitect";
import { DatabaseSychronizer } from "../databaseManipulation/DatabaseSynchronizer";
export declare class TableManagerListener extends ModuleListener {
    private dbSync;
    constructor(module: AuriaArchitect);
    getRequiredRequestHandlers(): AuriaMiddleware[];
    getExposedActionsDefinition(): ListenerActionsDefinition;
    protected getDatabaseSynchronizer(conn: number): DatabaseSychronizer;
    situation: ListenerAction;
    databaseSync: ListenerAction;
    private syncComparissonWithAuria;
    private createColumnFromComparisson;
    rawTypeToDataType(type: string): string;
    toCamelCase(str: string, join?: string): string;
    private syncColumnWithComparisson;
    private fetchTableDescription;
    private compareColumnDescripion;
    list: (req: AuriaRequest, res: AuriaResponse) => void;
}
