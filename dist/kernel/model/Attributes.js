"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValueHistory_1 = require("./ValueHistory");
const events_1 = require("events");
class Attributes extends events_1.EventEmitter {
    constructor() {
        super();
        /**
         * | Values
         * |================================================
         * |    Hold all the attributes ordered by name
         * | Values have a history, changed properties can be rolled back
         * | to previous states.
         * |    Attributes also fire events when something happens to them
         */
        this.values = {};
        this.changedAttrs = new Set();
    }
    /**
     * Define a set of attributes
     * @param attributes All the attributes to be set
     * @param trigger If this setAttrbute is  change in valus or just a initial set
     */
    setAttribute(attributes, trigger) {
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                /*
                / (???) Initial setup of values should trigger change?
                / Options are:
                / 1. put changedAttr inside of 'else' forgiving the dev that forgot to pass 'false' to triggerChange
                / 2. put changedAttr outside of it, making the behaviour of setAttribute predictable (you know that if tou don't pass triger as false "change behaviour" will apply)
                */
                if (this.values[attr] == null) {
                    this.values[attr] = new ValueHistory_1.ValueHistory(attr, attributes[attr]);
                }
                else {
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
    getAttribute(name) {
        return this.values[name];
    }
    /**
     *  Check if there's an attribute
     * @param name Attribute name
     */
    hasAttribute(name) {
        return (this.values[name] != null);
    }
    /**
     * | All Atributes name
     * |=============================================
     * | Retrieves all attribute name
     */
    allAttributesName() {
        return Object.keys(this.values);
    }
    /**
     * All Attributes
     * ---------------
     *
     * Return all attributes with the last set value to them
     */
    allAttributes() {
        let allAttr = {};
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
exports.Attributes = Attributes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXR0cmlidXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kZWwvQXR0cmlidXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE4QztBQUM5QyxtQ0FBc0M7QUFFdEMsTUFBYSxVQUFXLFNBQVEscUJBQVk7SUFleEM7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQWZaOzs7Ozs7O1dBT0c7UUFDSyxXQUFNLEdBRVYsRUFBRSxDQUFDO1FBTUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsWUFBWSxDQUFDLFVBRVosRUFBRSxPQUFpQjtRQUNoQixLQUFLLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRTtZQUN6QixJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBRWpDOzs7OztrQkFLRTtnQkFDRixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO29CQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksMkJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7aUJBQy9EO3FCQUFNO29CQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNoRDtnQkFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMvQjthQUNKO1NBQ0o7UUFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLElBQVk7UUFDckIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxZQUFZLENBQUMsSUFBWTtRQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlCQUFpQjtRQUNiLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsYUFBYTtRQUNULElBQUksT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFRCxzQkFBc0I7UUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7Q0FDSjtBQXJHRCxnQ0FxR0MifQ==