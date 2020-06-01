import { ResourceIdentification, ResourceAccessRuleList } from "./ResourceAccessRuleList.js";
import { ActionMetadata } from "../../module/api/ListenerAction.js";

export type AccessRuleFactory =
    (resourceDefinition: ResourceIdentification, accessRuleDefinition: ActionMetadata) => ResourceAccessRuleList;