"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Model_1 = require("./Model");
class Collection extends events_1.EventEmitter {
    constructor(name) {
        super();
        /**
         * Inner Count
         * ------------
         *
         * Auto Increment number used to generate inner ID's
         */
        this.innerCount = 1;
        /**
         * Name
         * ------
         *
         * Name of this collection
         */
        this.name = "";
        this._models = new Map();
        this.name = name || "Collection";
    }
    /**
     * Set Name
     * --------
     *
     * Defines the name of this collection
     *
     * @param name
     */
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    /**
     * Size
     * -----
     *
     * Alias to getAllModels().size()
     */
    size() {
        return this._models.size;
    }
    /**
     * Where
     * ------
     *
     * Creates a new collection with a subset of models that matches
     * the given value
     *
     * @param attribute What attribute(s) will be used, '*' means all
     * @param value Value to be compared with
     * @param compareAs Defines how the comparisson will be made, 'equal'
     *          means that the value must match completely, 'like' will check
     *          if the given value is a substring
     */
    where(attribute, value, compareAs) {
        let answer = new Collection(this.name + '[' + attribute + ' ' + compareAs + ' ' + value + ']');
        this._models.forEach((model, key) => {
            if (typeof attribute == "string") {
                if (this.compareAttribute(model.getAttribute(attribute), value, compareAs)) {
                    answer.addModel(model, key);
                }
            }
            else {
                let includeIt = false;
                attribute.forEach((attr) => {
                    if (this.compareAttribute(model.getAttribute(attr), value, compareAs)) {
                        includeIt = true;
                    }
                });
                if (includeIt) {
                    answer.addModel(model, key);
                }
            }
        });
        return answer;
    }
    compareAttribute(value, checkWith, compareAs) {
        switch (compareAs) {
            case "like":
                return value.indexOf(checkWith) >= 0;
            case "equal":
                return value == checkWith;
            case "greater":
            case ">":
                return value > checkWith;
            case "lesser":
            case "<":
                return value < checkWith;
            case "<=":
                return value <= checkWith;
            case ">=":
                return value >= checkWith;
            case "<>":
            case "!=":
                return value != checkWith;
        }
    }
    whereIn(attribute, values, compareAs) {
        let answer = new Collection();
        return answer;
    }
    removeModel(what) {
        //Trying to delete by model, expensive!
        if (what instanceof Model_1.Model) {
            this._models.forEach((model, key) => {
                if (model == what) {
                    this._models.delete(key);
                    this.emit("modelRemoved", what);
                    return false;
                }
                return true;
            });
            return what;
        }
        //Trying to delete by key! Better!
        else {
            if (this._models.has(what)) {
                let m = this._models.get(what);
                this._models.delete(what);
                this.emit("modelRemoved", m);
                return m;
            }
            else {
                return null;
            }
        }
    }
    addModel(model, key) {
        let rKey = key == undefined ? "CID-" + this.innerCount++ : key;
        this._models.set(rKey, model);
        this.emit("modelAdded", model);
        return rKey;
    }
    getModel(key) {
        if (this._models.has(key)) {
            return this._models.get(key);
        }
        return null;
    }
    getAllModels() {
        let nMap = new Map();
        this._models.forEach((model, key) => {
            nMap.set(key, model);
        });
        return nMap;
    }
    /**
     *
     * @param model
     */
    hasModel(model) {
        return !(Array.from(this._models.values()).indexOf(model) < 0);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kZWwvQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUN0QyxtQ0FBZ0M7QUFNaEMsTUFBYSxVQUFXLFNBQVEscUJBQVk7SUEyQnhDLFlBQVksSUFBYTtRQUNyQixLQUFLLEVBQUUsQ0FBQztRQWxCWjs7Ozs7V0FLRztRQUNLLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFFdkI7Ozs7O1dBS0c7UUFDTyxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBS3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxZQUFZLENBQUM7SUFDckMsQ0FBQztJQUdEOzs7Ozs7O09BT0c7SUFDSCxPQUFPLENBQUMsSUFBWTtRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTztRQUNILE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsS0FBSyxDQUFDLFNBQTRCLEVBQUUsS0FBVSxFQUMxQyxTQUErQjtRQUUvQixJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQ3BFLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQVksRUFBRSxHQUFXLEVBQUUsRUFBRTtZQUUvQyxJQUFJLE9BQU8sU0FBUyxJQUFJ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