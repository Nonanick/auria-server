import { EventEmitter } from 'events';
import { ResourceAccessRuleList, ResourceIdentification } from './ResourceAccessRuleList.js';
import { SystemUser } from '../user/SystemUser.js';
import { AccessRuleContext } from './AccessRule.js';
import { AccessRuleFactory } from './AccessRuleFactory.js';
import { System } from '../../System.js';
import { ActionMetadata } from '../../module/api/ListenerAction.js';
import { Module } from '../../module/Module.js';
import { ModuleListener } from '../../module/api/ModuleListener.js';
import { SystemRequest } from '../../http/request/SystemRequest.js';

export class AccessPolicyEnforcer extends EventEmitter {

    public static EVENT_ACCESS_RULE_FACTORY_SET = "RuleFactorySet";

    private system: System;

    private apiResourceRules: Map<string, ResourceAccessRuleList>;

    protected accessRuleFactory: AccessRuleFactory;

    protected accessRuleFactorySetPromise: Promise<AccessRuleFactory>;

    constructor(system: System) {
        super();

        this.system = system;
        this.apiResourceRules = new Map();

        this.accessRuleFactorySetPromise = new Promise((resolve, reject) => {
            this.once(AccessPolicyEnforcer.EVENT_ACCESS_RULE_FACTORY_SET, () => {

                resolve(this.accessRuleFactory);
            });
        });

        this.system.getAllModules().forEach((mod) => {
            this.loadRulesFromModuleResources(mod);
        });

        this.system.addListener(
            System.EVENT_SYSTEM_MODULE_ADDED,
            (module) => this.loadRulesFromModuleResources(module)
        );


    }

    public setAccessRuleFactory(factory: AccessRuleFactory) {
        this.accessRuleFactory = factory;
        this.emit(AccessPolicyEnforcer.EVENT_ACCESS_RULE_FACTORY_SET, this.accessRuleFactory);
        return this;
    }

    protected loadRulesFromModuleResources(module: Module) {
        console.log("[AccessPolicy] Loading modules access rules: ", module.name, "\n");

        module.getAllListeners().forEach((listener) => {
            this.loadRulesFromListenerResources(listener);
        });
    }

    protected loadRulesFromListenerResources(listener: ModuleListener) {
        let actionsMetadata = listener.getMetadataFromExposedActions();

        console.log("[AccessPolicy] Listener ", listener.name, " exposed the following actions: ", actionsMetadata);

        for (var actionName in actionsMetadata) {
            if (actionsMetadata.hasOwnProperty(actionName)) {
                this.loadRulesFromActionMetadata(
                    {
                        module: listener.getModuleName(),
                        listener: listener.name,
                        action: actionName
                    },
                    actionsMetadata[actionName]
                );
            }
        }
    }

    protected loadRulesFromActionMetadata(resourceId: ResourceIdentification, metadata: ActionMetadata) {
        this.accessRuleFactorySetPromise.then((factory) => {
            let accessRuleList = factory(resourceId, metadata);
            this.addResourceRule(accessRuleList);
        });
    }

    public async authorize(user: SystemUser, request: SystemRequest): Promise<boolean> {

        const params = Object.assign({}, request.body, request.query, request.params);

        let context: AccessRuleContext = {
            system : this.system,
            requestStack: request.getRequestStack(),
            user: user,
            params : params
        };
    
        let stack = request.getRequestStack();
        let stackResourceName = (stack.module() + "." + stack.listener() + "." + stack.action()).trim().toLowerCase();

        console.log("[APE] WIll apply rules on context!", this.apiResourceRules.get(stackResourceName));

        if (this.apiResourceRules.has(stackResourceName)) {

            let list = this.apiResourceRules.get(stackResourceName)!;
            let authorized = await list.applyRulesOnContext(context);

            console.log("[APE] Was user request authorized? ", authorized);

            return authorized;
        } else {
            console.error(
                "[APE] Failed to locate resource rule list for stack ",
                "'" + stackResourceName + "' "
            );
            return false;
        }
        return true;
    }

    public addResourceRule(ruleList: ResourceAccessRuleList) {

        console.log(
            "[APE] Adding rule list!",
            ruleList.getResourceNameAsString(), " to apiResourceRules!"
        );

        // Rule List does not exists?
        if (!this.apiResourceRules.has(ruleList.getResourceNameAsString())) {
            this.apiResourceRules.set(ruleList.getResourceNameAsString(), ruleList);
        }
        // If it does, merge
        else {
            let oldRuleList = this.apiResourceRules.get(ruleList.getResourceNameAsString())!;
            ruleList.getAllRules().forEach(([ruleName, ruleFn]) => {
                oldRuleList.addRule(ruleFn);
            });
            console.log(
                "[AccessPolicyEnforcer] Merged Resource Access Rules Lists", oldRuleList
            );
        }

        return this;

    }

    public getResourceRule(name: string): ResourceAccessRuleList | undefined;
    public getResourceRule(name: ResourceIdentification): ResourceAccessRuleList | undefined;
    public getResourceRule(name: string | ResourceIdentification): ResourceAccessRuleList | undefined {
        if (typeof name != "string") {
            name = (name.module + "." + name.listener + "." + name.action).trim().toLowerCase();
        }

        return this.apiResourceRules.get(name);
    }

    public hasResourceRule(name: string): boolean {
        return this.apiResourceRules.has(name);
    }

}