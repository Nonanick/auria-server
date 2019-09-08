export class ValueHistory {
    
    /**
     * Field
     * ------
     * 
     * This value history field name
     */
    field: string;

    /**
     * Values
     * ------
     * 
     * Array containing all the values that were set to this object
     */
    private values: any[];

    /**
     * Original Value
     * ---------------
     * 
     * Holds the first value set for this value history
     */
    private originalValue: any;

    constructor(field: string, initialValue?: any) {

        this.field = field;
        this.values = [];

        if (initialValue != null) {
            this.values.push(initialValue);
            this.originalValue = initialValue;
        }
    }

    /**
     * Get Last Value
     * ---------------
     * 
     * Return the last set value for this object, if none was set undefined is returned!
     */
    getLastValue(): any {

        if (this.values.length > 0) {
            return this.values[this.values.length - 1];
        }

        return undefined;
    }

    /**
     * Add Value
     * ----------
     * 
     * Adds a new Value for this object history, it will be placed on top of the others
     * 
     * @param value value to be assigned to the field
     */
    addValue(value: any): ValueHistory {

        //First value assigned will be set as the "original" value
        if (this.values.length === 0) {
            this.originalValue = value;
        }

        this.values.push(value);

        return this;
    }

    /**
     * Set Original Value
     * --------------------
     * 
     * Define the value considered as "original", it will be pushed at the BEGGINING of the
     * values stack and can't be rolled back!
     * 
     * The old "originalValue", if exists, will be REMOVED from the stack
     * 
     * "Original Value"s don't trigger "change" on the attributes
     * 
     * @param value The new "Original Value"
     * @returns The old "Original Value" removed from the stack
     */
    setOriginalValue(value: any): any {
        this.originalValue = value;
        var oldOriginalValue = this.values.shift();
        this.values = [value].concat(this.values);

        return oldOriginalValue;
    }

    /**
     * Reset
     * ------
     * 
     * Empty this value history, only preserves the "original value"
     * or the first value set
     */
    reset(): ValueHistory {
        this.rollback(-1);
        return this;
    }

    /**
     * Rollback
     * ----------
     * 
     * Rollback a change in the values, the original value can't be rolled back!
     * 
     * Meaning that after this function at least the FIRST assigned value will be preserved,
     * despite the number of times to be rolled back passed, a negative number will act the same as
     * the reset function!
     * 
     * @param times the number of rollbacks to be made, a negative number will set it back to its original value!
     * 
     */
    rollback(times = 0) {
        
        if (times < 0) {
            this.values = [this.originalValue];
        } else {
            do {
                if (this.values.length > 1) {
                    this.values.pop();
                }
            } while (times-- > 0);
        }
    }

    /**
     * Get Original Value
     * -------------------
     * 
     * Get the first value set to this object
     */
    getOriginalValue() {
        return this.originalValue;
    }

}
