import { System } from "../../System";
import { Collection } from "aurialib2";
export declare abstract class KernelEntity extends Collection {
    protected system: System;
    constructor(system: System, name?: string);
    protected __createAction: () => void;
    protected __updateAction: () => void;
    columnToFieldName(colName: string): string;
    abstract asJSON(): {
        [prop: string]: any;
    };
}
