import { GuestsCantAccessUserListener } from './actions/interfaceMapper/GuestsCantAccessUser.js';
import { Module } from '../../Module.js';
import { AuriaListenerActionMetadata } from '../../../../default/module/listener/AuriaListenerActionMetadata.js';
import { ModuleListener } from '../../api/ModuleListener.js';
import { ListenerAction } from '../../api/ListenerAction.js';
import { ModulePageRowData } from '../../../resource/rowModel/ModulePageRowData.js';
import { ModuleMenuRowData } from '../../../resource/rowModel/ModuleMenuRowData.js';

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
            "interfaceMap": {
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

    public interfaceMap: ListenerAction = async (req) => {

        let interfaceMap = await req.getUser().getInterfaceMap().asJSON();
        return { ...interfaceMap };

    };

}

export type UserListenerInterfaceMap = {
    pages: { [name: string]: ModulePageRowData },
    menus: { [name: string]: (ModuleMenuRowData & UserListenerInterfaceMap) }
};