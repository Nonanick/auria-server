import { AuriaActionMetadata } from "../../../../../../default/module/listener/AuriaListenerActionMetadata";
import { SystemUser } from "../../../../../security/SystemUser";

export const LogoutActionMetadata : AuriaActionMetadata = {
    DISABLE_BLACKLIST_RULE : true,
    DISABLE_WHITELIST_RULE: true,
    accessRules : [
        {
            name : 'GuestsCantLogout',
            rule : async (context) => {
                return context.user.getUsername() != SystemUser.GUEST_USERNAME;
            }
        }
    ]
}