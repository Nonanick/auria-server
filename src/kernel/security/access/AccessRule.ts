import { SystemUser } from "../SystemUser";
import { RequestStack } from "../../RequestStack";
import { AccessRuleCondition } from "./ResourceAccessRule";

export interface AccessRuleContext {
    requestStack : RequestStack;
    user : SystemUser;
}

export class AccessRule {

    protected name : string;

    protected rule : AccessRuleCondition;

    constructor(ruleIdentifier : string) {
        this.name = ruleIdentifier;
    }

    public getName() {
        return this.name;
    }

    public setRuleFunction(rule : AccessRuleCondition) {
        this.rule = rule;
    }

    public async applyRuleOnContext(context : AccessRuleContext) {
        return this.rule(context);
        
    }

}

export interface AccessRuleDefinition {
    name : string;
    rule : AccessRuleCondition;
}