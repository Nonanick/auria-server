/// <reference types="node" />
import { Module } from "./Module";
import { Table } from "../database/structure/table/Table";
import { EventEmitter } from "events";
import { AuriaMiddleware } from "../http/AuriaMiddleware";
import { ListenerRequest } from "../http/request/ListenerRequest";
export declare type ModuleListenerEvents = "actionFinished" | "actionError" | "load";
export declare type ListenerAction = (request: ListenerRequest) => any | Promise<any>;
export declare type ListenerRequiredPermissions = {
    tables?: {
        [tableName: string]: {
            actions: string[];
        };
    };
};
export declare type ListenerActionsDefinition = {
    [action: string]: ListenerRequiredPermissions;
};
export declare abstract class ModuleListener extends EventEmitter {
    protected module: Module;
    name: string;
    protected tables: Map<string, Table>;
    constructor(module: Module, name: string);
    abstract getExposedActionsDefinition(): ListenerActionsDefinition;
    abstract getRequiredRequestHandlers(): AuriaMiddleware[];
    emit(event: ModuleListenerEvents, ...args: any[]): boolean;
    whenActionFinished(fn: () => void): void;
    done(): void;
    setTables(tables: Map<string, Table>): ModuleListener;
    handleRequest(request: ListenerRequest): Promise<any>;
}
