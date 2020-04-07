import { ModuleListener } from "../../ModuleListener";
import { Module } from "../../Module";
import { LoginAttemptManager } from "./actions/login/LoginAttemptManager";
import { ListenerAction } from "../../ListenerAction";
import { AuriaListenerActionMetadata } from "../../../../default/module/listener/AuriaListenerActionMetadata";
export declare class LoginListener extends ModuleListener {
    /**
     * Amount of time required to complete
     * the login request
     */
    static LOGIN_LISTENER_DELAY_LOGIN_ATTEMPT: number;
    protected loginAttemptManager: LoginAttemptManager;
    constructor(module: Module);
    getExposedActionsMetadata(): AuriaListenerActionMetadata;
    login: ListenerAction;
    logout: ListenerAction;
}
