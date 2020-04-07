import { ListenerRequest } from "../http/request/ListenerRequest";
import { AccessRuleDefinition } from "../security/access/AccessRule";

export type ListenerAction = (request: ListenerRequest) => any | Promise<any>;

export type ListenerActionDataDependencies = {
    [tableName: string]: {
        actions: string[];
    };
};

export interface ActionMetadata {
    accessRules?: AccessRuleDefinition[];
    dataDependencies?: ListenerActionDataDependencies;
}

export type ListenerActionsMetadata = {
    [action: string]: ActionMetadata;
};