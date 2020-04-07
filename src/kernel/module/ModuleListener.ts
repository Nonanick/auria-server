import { Module } from "./Module";
import { EventEmitter } from "events";
import { ListenerRequest } from "../http/request/ListenerRequest";
import { ListenerActionUnavaliable } from "../exceptions/kernel/ListenerActionUnavaliable";
import { ListenerAction, ListenerActionsMetadata } from "./ListenerAction";

export type ModuleListenerEvents = "actionFinished" | "actionError" | "load";

export abstract class ModuleListener extends EventEmitter {

    /**
     * Module
     * -------
     * 
     * Module that this listener belongs to
     */
    protected module: Module;

    /**
     * Name
     * ------
     * 
     * Listener name, will identify it unquelly inside its module!
     */
    public name: string;

    constructor(module: Module, name: string) {
        super();
        this.module = module;
        this.name = name;
    }

    /**
     * [GET] Exposed Actions Definitions
     * ----------------------------------
     * 
     * Should return all the functions inside this listener
     * that will be accessible in the API;
     * 
     * Metadata about the necessary Tables (SQL) and Access Rules
     * also are exposed to the system here!
     */
    public abstract getExposedActionsMetadata(): ListenerActionsMetadata;

    /**
     * Emit
     * ------
     * Typescript facility, exposes all ModuleListenerEvents as the first parameter
     * @override
     * 
     * @param event 
     * @param args 
     */
    public emit(event: ModuleListenerEvents | string, ...args: any[]) {
        return super.emit(event, args);
    }

    /**
     * Handle Request
     * --------------
     * 
     * Last part of the Express 'Request' object life cycle
     * inside Auria!
     * Should call the desired action
     * @param request 
     */
    public async handleRequest(request: ListenerRequest) {

        let requestedAction: string = request.getRequestStack().action();

        let actionsDefinition: ListenerActionsMetadata = this.getExposedActionsMetadata();

        if (!actionsDefinition.hasOwnProperty(requestedAction)) {
            throw new ListenerActionUnavaliable("The requested action in the listener does not exist or is not exposed!");
        }

        let actionFn: ListenerAction = (this as any)[requestedAction] as ListenerAction;
        
        if(actionFn == null) {
            
            console.error("[ModuleListener] The required action is not a function in this ModuleListener even tough it has been exposed!\nCheck the spelling, the action name and function name should match exactly!");

            throw new ListenerActionUnavaliable("The requested action in the listener does not exist or is not exposed!");
        }

        return actionFn(request);

    }

    public getModuleName() : string {
        return this.module.name;
    }

}