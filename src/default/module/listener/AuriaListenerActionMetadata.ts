import { ListenerActionsMetadata, ListenerActionDataDependencies, ActionMetadata } from "../../../kernel/module/ListenerAction";
import { AccessRuleDefinition } from "../../../kernel/security/access/AccessRule";

export interface AuriaActionMetadata extends ActionMetadata {
    accessRules?: AccessRuleDefinition[];
    dataDependencies?: ListenerActionDataDependencies;
    DISABLE_WHITELIST_RULE?: boolean;
    DISABLE_BLACKLIST_RULE?: boolean;
}

export interface AuriaListenerActionMetadata extends ListenerActionsMetadata {
    [action: string]: AuriaActionMetadata
}