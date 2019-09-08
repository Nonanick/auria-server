import { EventEmitter } from "events";
import { Attributes } from "./Attributes";


export type ModelEvents = "changed" | "created" | "deleted" | "locked" | "unlocked";

export class Model extends EventEmitter {


    protected attributes: Attributes;

    constructor() {
        super();
        this.attributes = new Attributes();
    }

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
    setAttribute(attributes: { [fieldName: string]: any }, triggerEvent?: boolean): Model;
    setAttribute(
        attrNameOrObject: string | { [fieldName: string]: any },
        triggerOrValue: any,
        trigger?: boolean
    ) {

        if (typeof attrNameOrObject === "string") {
            let nObj: any = {};
            nObj[attrNameOrObject] = triggerOrValue;
            return this.setAttribute(nObj, trigger);
        }
        else {
            trigger = triggerOrValue;
        }

        //Holds the old values
        let oldValues: any = {};
        for (var at in attrNameOrObject) {
            if (attrNameOrObject.hasOwnProperty(at)) {
                oldValues[at] = this.attributes.getAttribute(at);
            }
        }

        this.attributes.setAttribute(attrNameOrObject, trigger);

        if (trigger !== false) {
            this.emit("changed", { oldValues: oldValues, values: attrNameOrObject, newValues: attrNameOrObject });
        }

        return this;
    }

    public getAttribute(attrName: string) {
        return this.attributes.getAttribute(attrName).getLastValue();
    }

    public getAttributesName() {
        return this.attributes.allAttributesName();
    }

    public asJSON(): any {
        return this.attributes.allAttributes();
    }
}