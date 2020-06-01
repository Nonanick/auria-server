import { ListenerRequest } from "../../http/request/ListenerRequest.js";import { AccessRuleDefinition } from "../../security/access/AccessRule.js";

/**
 * Listener Action
 * ----------------
 * Class method that is formatted to be treated as a public method,
 * acessible through an API endpoint
 */
export type ListenerAction = (request: ListenerRequest) => any | Promise<any>;

/**
 * Listener Action Data Dependencies
 * ---------------------------------
 * 
 * Expose to the server which data resources are needed to 
 * this action be executed.
 * 
 * If a user is trying to access this method without the expressed
 * data permission the method will be executed but will not receive ANY
 * data from the DB;
 * 
 * An WARNING will be generated in the logs
 */
export type ListenerActionDataDependencies = {
    [tableName: string]: {
        actions: string[];
    };
};

/**
 * Action Metadata
 * ---------------
 * 
 * Exposes to the server what are the requirements to execute
 * a public method and its API Access Rules (different from data permission!)
 * 
 */
export interface ActionMetadata {
    accessRules?: AccessRuleDefinition[];
    dataDependencies?: ListenerActionDataDependencies;
}

export type ListenerActionsMetadata = {
    [action: string]: ActionMetadata;
};