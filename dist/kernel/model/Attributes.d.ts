/// <reference types="node" />
import { ValueHistory } from "./ValueHistory";
import { EventEmitter } from "events";
export declare class Attributes extends EventEmitter {
    /**
     * | Values
     * |================================================
     * |    Hold all the attributes ordered by name
     * | Values have a history, changed properties can be rolled back
     * | to previous states.
     * |    Attributes also fire events when something happens to them
     */
    private values;
    private changedAttrs;
    constructor();
    /**
     * Define a set of attributes
     * @param attributes All the attributes to be set
     * @param trigger If this setAttrbute is  change in valus or just a initial set
     */
    setAttribute(attributes: {
        [fieldName: string]: any;
    }, trigger?: boolean): void;
    /**
     * Retrieves all the values associated with a field
     * @param name Attribute name
     */
    getAttribute(name: string): ValueHistory;
    /**
     *  Check if there's an attribute
     * @param name Attribute name
     */
    hasAttribute(name: string): boolean;
    /**
     * | All Atributes name
     * |=============================================
     * | Retrieves all attribute name
     */
    allAttributesName(): string[];
    /**
     * All Attributes
     * ---------------
     *
     * Return all attributes with the last set value to them
     */
    allAttributes(): any;
    getChangedAttributes(): Set<string>;
    resetChangedAttributes(): void;
}
