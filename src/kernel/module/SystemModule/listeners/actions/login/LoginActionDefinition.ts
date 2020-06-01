import { AuriaActionMetadata } from "../../../../../../default/module/listener/AuriaListenerActionMetadata.js";
import { SystemUser } from "../../../../../security/user/SystemUser.js";



export const LoginActionMetadata : AuriaActionMetadata = {
    DISABLE_BLACKLIST_RULE : true,
    DISABLE_WHITELIST_RULE: true,
    accessRules : [
        {
            name : 'OnlyGuestsCanLogin',
            rule : async (context) => {
                return context.user.getUsername() == SystemUser.GUEST_USERNAME;
            }
        }
    ]
};