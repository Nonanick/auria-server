/// <reference types="node" />
import { Module } from "./Module";
import { EventEmitter } from "events";
import { ListenerRequest } from "../http/request/ListenerRequest";
import { ListenerActionsMetadata } from "./ListenerAction";
export declare type ModuleListenerEvents = "actionFinished" | "actionError" | "load";
export declare abstract class ModuleListener extends EventEmitter {
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
    name: string;
    constructor(module: Module, name: string);
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
    abstract getExposedActionsMetadata(): ListenerActionsMetadata;
    /**
     * Emit
     * ------
     * Typescript facility, exposes all ModuleListenerEvents as the first parameter
     * @override
     *
     * @param event
     * @param args
     */
    emit(event: ModuleListenerEvents | string, ...args: any[]): boolean;
    /**
     * Handle Request
     * --------------
     *
     * Last part of the Express 'Request' object life cycle
     * inside Auria!
     * Should call the desired action
     * @param request
     */
    handleRequest(request: ListenerRequest): Promise<any>;
    getModuleName(): string;
}
