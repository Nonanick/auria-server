import { AccessRuleDefinition } from "../../kernel/security/access/AccessRule.js";
import { SystemUserPrivilege } from "../../kernel/security/user/SystemUser.js";

export const OnlyAdminsCanAccessArchitect: AccessRuleDefinition = {
    name: "OnlyAdminsCanAccessArchitect",
    rule: async (context) => {
        return context.user.getAccessLevel() >= SystemUserPrivilege.ADMIN;
    }
};