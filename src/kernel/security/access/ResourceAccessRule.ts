import { AccessRuleContext } from "./AccessRule.js";

export type AccessRuleCondition = (context : AccessRuleContext) => Promise<boolean>;