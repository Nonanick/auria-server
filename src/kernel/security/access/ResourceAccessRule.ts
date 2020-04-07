import { AccessRuleContext } from "./AccessRule";

export type AccessRuleCondition = (context : AccessRuleContext) => Promise<boolean>;