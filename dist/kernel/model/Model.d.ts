/// <reference types="node" />
import { EventEmitter } from "events";
import { Attributes } from "./Attributes";
export declare type ModelEvents = "changed" | "created" | "deleted" | "locked" | "unlocked";
export declare class Model extends EventEmitter {
    protected attributes: Attributes;
    constructor();
    /**
     * Set Attribute
     * --------------
     *
     * @param attrName attribute that will be set
     * @param attrValue value to be set
     * @param triggerEvent If change event will be fired, by default it triggers!
     *
     * @returns This instance for chainning
     */
    setAttribute(attrName: string, attrValue: any, triggerEvent?: boolean): Model;
    /**
     * Set Attribute
     * --------------
     *
     * @param attributes object containing all of the attributes that shall change
     * @param triggerEvent if this setAttribute will trigger "change" event on the model
     *
     * @returns This instance for chainning
     */
    setAttribute(attributes: {
        [fieldName: string]: any;
    }, triggerEvent?: boolean): Model;
    getAttribute(attrName: string): any;
    getAttributesName(): string[];
    asJSON(): any;
}
