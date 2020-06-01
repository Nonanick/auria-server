import { GuestsCantAccessUserListener } from './actions/interfaceMapper/GuestsCantAccessUser.js';
import { Module } from '../../Module.js';
import { AuriaListenerActionMetadata } from '../../../../default/module/listener/AuriaListenerActionMetadata.js';
import { ModuleListener } from '../../api/ModuleListener.js';
import { ListenerAction } from '../../api/ListenerAction.js';

export class UserListener extends ModuleListener {


    constructor(module: Module) {
        super(module, "User");
    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
        return {
            "info": {
                DISABLE_BLACKLIST_RULE: true,
                DISABLE_WHITELIST_RULE: true,
                accessRules: [GuestsCantAccessUserListener]
            },
            "interfaceMapper": {
                DISABLE_BLACKLIST_RULE: true,
                DISABLE_WHITELIST_RULE: true,
                accessRules: [GuestsCantAccessUserListener]
            }
        };
    }

    public info: ListenerAction = (request) => {
        let user = request.getUser();
        return user.getUserInfo();
    };

    public interfaceMapper: ListenerAction = async (req) => {
        await req.getUser().getInterfaceMap().build();
    };
}