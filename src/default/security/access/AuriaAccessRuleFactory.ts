import { AccessRuleFactory } from "../../../kernel/security/access/AccessRuleFactory";
import { ResourceAccessRuleList } from "../../../kernel/security/access/ResourceAccessRuleList";
import { AuriaActionMetadata } from "../../module/listener/AuriaListenerActionMetadata";
import { AuriaSystem } from "../../AuriaSystem";
import { AccessRule } from "../../../kernel/security/access/AccessRule";
import { AccessRuleCondition } from "../../../kernel/security/access/ResourceAccessRule";

export class AuriaAccessRuleFactory {

    private system: AuriaSystem;

    private factory: AccessRuleFactory = (resource, definition: AuriaActionMetadata) => {

        let list = new ResourceAccessRuleList(resource);

        if (definition.DISABLE_BLACKLIST_RULE !== true) {
            list.addRule(this.blacklistRule);
        }

        if (definition.DISABLE_WHITELIST_RULE !== true) {
            list.addRule(this.whitelistRule);
        }

        if (definition.accessRules != null) {
            for (let a = 0; a < definition.accessRules.length; a++) {
                let ruleDefinition = definition.accessRules[a];

                let rule = new AccessRule(ruleDefinition.name);
                rule.setRuleFunction(ruleDefinition.rule);

                list.addRule(rule);
            }
        }
        return list;
    };

    private whitelistRule: AccessRule;

    private blacklistRule: AccessRule;

    constructor(system: AuriaSystem) {
        this.system = system;

        this.whitelistRule = this.buildWhitelistRule();
        this.blacklistRule = this.buildBlacklistRule();
    }

    private buildWhitelistRule(): AccessRule {

        let rule = new AccessRule("UserHasExplicitPermission");

        let condition: AccessRuleCondition = async (context) => {

            let userRoleIds = await context.user.getUserAccessRoleIds();

            return this.system.getSystemConnection()
                .select("resource_name", "parameters")
                .from("access_whitelist")
                .where({
                    user: context.user.getUsername(),
                })
                .orWhereIn("role_id", userRoleIds)
                .then((results) => {
                    if(results != null) {
                        return results.length != 0;
                    } else {
                        return false;
                    }
                });
        };

        rule.setRuleFunction(condition);

        return rule;
    }

    private buildBlacklistRule(): AccessRule {
        
        let rule = new AccessRule("UserDoenstHaveExplicitDenial");

        let condition: AccessRuleCondition = async (context) => {

            let userRoleIds = await context.user.getUserAccessRoleIds();

            return this.system.getSystemConnection()
                .select("resource_name", "parameters")
                .from("access_blacklist")
                .where({
                    user: context.user.getUsername(),
                })
                .orWhereIn("role_id", userRoleIds)
                .then((results) => {
                    if(results != null) {
                        return results.length <= 0;
                    } else {
                        return true;
                    }
                });
        };

        rule.setRuleFunction(condition);

        return rule;
    }
    public getFactoryFunction(): AccessRuleFactory {
        return this.factory;
    }
}