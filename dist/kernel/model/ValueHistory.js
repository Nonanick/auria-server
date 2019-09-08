"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValueHistory {
    constructor(field, initialValue) {
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
    getLastValue() {
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
    addValue(value) {
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
    setOriginalValue(value) {
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
    reset() {
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
        }
        else {
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
exports.ValueHistory = ValueHistory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVIaXN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9tb2RlbC9WYWx1ZUhpc3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFhLFlBQVk7SUEwQnJCLFlBQVksS0FBYSxFQUFFLFlBQWtCO1FBRXpDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztTQUNyQztJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFlBQVk7UUFFUixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUM7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILFFBQVEsQ0FBQyxLQUFVO1FBRWYsMERBQTBEO1FBQzFELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxnQkFBZ0IsQ0FBQyxLQUFVO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyxPQUFPLGdCQUFnQixDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUM7UUFFZCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3RDO2FBQU07WUFDSCxHQUFHO2dCQUNDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNyQjthQUNKLFFBQVEsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1NBQ3pCO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsZ0JBQWdCO1FBQ1osT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7Q0FFSjtBQTlJRCxvQ0E4SUMifQ==