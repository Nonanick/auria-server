import { AccessRule, AccessRuleContext } from "./AccessRule.js";


export type ResourceIdentification = {
    module: string;
    listener: string;
    action: string;
};

export class ResourceAccessRuleList {

    protected resource: ResourceIdentification;

    private rules: Map<string, AccessRule>;

    constructor(resource: ResourceIdentification) {
        this.resource = resource;
        this.rules = new Map();
    }

    public getResourceNameAsString(): string {
        return (this.resource.module + "." + this.resource.listener + "." + this.resource.action).trim().toLowerCase();
    }

    public addRule(rule: AccessRule) {

        if (this.rules.has(rule.getName())) {
            console.log("[ResourceAccessRuleList] Rule list for resource ", this.getResourceNameAsString(), " already has a rule with the name ", rule.getName(), " overriding it!");
        }

        this.rules.set(rule.getName(), rule);

        return rule;
    }

    public getAllRules() : [string , AccessRule][] {
        return Array.from(this.rules.entries());
    }

    public removeRule(ruleName: string): AccessRule | undefined {
        if (this.rules.has(ruleName)) {
            let delRule = this.rules.get(ruleName);
            this.rules.delete(ruleName);

            return delRule;
        }
        // Does not have it, dont do anything!
        return;
    }

    public async applyRulesOnContext(context: AccessRuleContext): Promise<boolean> {
        let allPromises: Promise<boolean>[] = [];

        //# - No access rules? go on!
        if(this.rules.size == 0) {
            console.log("[ResourceAccessRuleList] Empty Access Rule List! Authorizing access!");
            return true;
        }

        this.rules.forEach((rule) => {
            let ans = rule.applyRuleOnContext(context)
            allPromises.push(ans);
            ans.then((res) => {
                if(res == false) {
                    console.log("[ResourceAccessRule] Context failed to meet criteria ",context.user.getUsername(), "\nRule name: ", rule.getName());
                }
            });
        });

        let ans = Promise.all(allPromises).then((allValues) => {
            console.log("All Promises values!", allValues);
            if (allValues != null) {
                for (let a = 0; a < allValues.length; a++) {
                    if (allValues[a] == false)
                        return false;
                    else continue;
                }
            }

            return true;
        });

        ans.catch((error) => {
            console.error("[ResourceAccessRuleList] Failed to apply condition on the context!", context, "\nError: ", error);
            throw error;
        });

        return ans;
    }



}