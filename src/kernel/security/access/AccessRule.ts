import { AccessRuleCondition } from "./ResourceAccessRule.js";
import { SystemUser } from "../user/SystemUser.js";
import { RequestStack } from "../../RequestStack.js";
import { System } from "../../System.js";

export interface AccessRuleContext {
    system : System;
    requestStack : RequestStack;
    user : SystemUser;
    params : any;
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