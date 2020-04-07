import { ResourceAccessRuleList, ResourceIdentification } from "./ResourceAccessRuleList";
import { ActionMetadata } from "../../module/ListenerAction";

export type AccessRuleFactory = (resourceDefinition: ResourceIdentification, accessRuleDefinition : ActionMetadata) => ResourceAccessRuleList;