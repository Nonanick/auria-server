import { Module } from "./Module";
import { Table } from "../database/structure/table/Table";
import { EventEmitter } from "events";
import { AuriaMiddleware } from "../http/AuriaMiddleware";
import { ListenerRequest } from "../http/request/ListenerRequest";
import { ListenerActionUnavaliable } from "../exceptions/kernel/ListenerActionUnavaliable";

export type ModuleListenerEvents = "actionFinished" | "actionError" | "load";

export type ListenerAction = (request: ListenerRequest) => any | Promise<any>;

export type ListenerRequiredPermissions = {
    tables?: {
        [tableName: string]: {
            actions: string[];
        };
    }
};

export type ListenerActionsDefinition = {
    [action: string]: ListenerRequiredPermissions;
};

export abstract class ModuleListener extends EventEmitter {

    protected module: Module;

    public name: string;

    protected tables: Map<string, Table>;

    constructor(module: Module, name: string) {
        super();
        this.module = module;
        this.name = name;
    }

    public abstract getExposedActionsDefinition(): ListenerActionsDefinition;

    public abstract getRequiredRequestHandlers(): AuriaMiddleware[];

    public emit(event: ModuleListenerEvents, ...args: any[]) {
        return super.emit(event, args);
    }

    public whenActionFinished(fn: () => void) {
        let onlyOnceHandler = () => {
            fn();
            this.removeListener("actionFinished", onlyOnceHandler);
        };

        this.addListener("actionFinished", onlyOnceHandler);

    }

    public done() {
        this.emit("actionFinished");
    }

    public setTables(tables: Map<string, Table>): ModuleListener {
        this.tables = tables;
        return this;
    }

    public async handleRequest(request: ListenerRequest) {

        let requestedAction: string = request.getRequestStack().action();

        let actionsDefinition: ListenerActionsDefinition = this.getExposedActionsDefinition();

        if (!actionsDefinition.hasOwnProperty(requestedAction)) {
            throw new ListenerActionUnavaliable("The requested action in the listener does not exist or is not exposed!");
        }

        let actionFn : ListenerAction = (this as any)[requestedAction] as ListenerAction;

        return actionFn(request);

    }

}