import { ValueHistory } from "./ValueHistory";
import { EventEmitter } from "events";

export class Attributes extends EventEmitter {
    /**
     * | Values
     * |================================================
     * |    Hold all the attributes ordered by name
     * | Values have a history, changed properties can be rolled back
     * | to previous states.
     * |    Attributes also fire events when something happens to them
     */
    private values: {
        [fieldName: string]: ValueHistory
    } = {};

    private changedAttrs: Set<string>;

    constructor() {
        super();
        this.changedAttrs = new Set();
    }
    /**
     * Define a set of attributes
     * @param attributes All the attributes to be set
     * @param trigger If this setAttrbute is  change in valus or just a initial set
     */
    setAttribute(attributes: {
        [fieldName: string]: any
    }, trigger?: boolean) {
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {

                /* 
                / (???) Initial setup of values should trigger change?
                / Options are: 
                / 1. put changedAttr inside of 'else' forgiving the dev that forgot to pass 'false' to triggerChange
                / 2. put changedAttr outside of it, making the behaviour of setAttribute predictable (you know that if tou don't pass triger as false "change behaviour" will apply)
                */
                if (this.values[attr] == null) {
                    this.values[attr] = new ValueHistory(attr, attributes[attr])
                } else {
                    this.values[attr].addValue(attributes[attr]);
                }

                if (trigger !== false) {
                    this.changedAttrs.add(attr);
                }
            }
        }

        if (trigger !== false) {
            this.emit("change", attributes);
        }
    }

    /**
     * Retrieves all the values associated with a field
     * @param name Attribute name
     */
    getAttribute(name: string): ValueHistory {
        return this.values[name];
    }

    /**
     *  Check if there's an attribute
     * @param name Attribute name
     */
    hasAttribute(name: string): boolean {
        return (this.values[name] != null);
    }

    /**
     * | All Atributes name
     * |=============================================
     * | Retrieves all attribute name
     */
    allAttributesName(): string[] {
        return Object.keys(this.values);
    }

    /**
     * All Attributes
     * ---------------
     * 
     * Return all attributes with the last set value to them
     */
    allAttributes() {
        let allAttr: any = {};

        this.allAttributesName().forEach((attr) => {
            allAttr[attr] = this.values[attr].getLastValue();
        });

        return allAttr;
    }

    getChangedAttributes() {
        return this.changedAttrs;
    }

    resetChangedAttributes() {
        this.changedAttrs = new Set();
    }
}