import { AccessRuleDefinition } from "../../../../../security/access/AccessRule.js";

export const GuestsCantAccessUserListener: AccessRuleDefinition =
{
    name: "GuestsCantAccessUserListener",
    rule: async (context) => {
        return context.user.getUsername() != "guest";
    }
};
