import { EventEmitter } from "events";
import { Model } from "./Model";

export type CollectionComparator = "like" | "equal" | "lesser" | "greater" | ">" | "<" | "<=" | ">=" | "<>" | "!=";

export type CollectionEvents = "modelAdded" | "modelRemoved";

export class Collection extends EventEmitter {

    /**
     * Models
     * -------
     * 
     * Map containing all the models
     */
    protected _models: Map<string, Model>;

    /**
     * Inner Count
     * ------------
     * 
     * Auto Increment number used to generate inner ID's
     */
    private innerCount = 1;

    /**
     * Name
     * ------
     * 
     * Name of this collection
     */
    protected name: string = "";


    constructor(name?: string) {
        super();
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
    setName(name: string) {
        this.name = name;
    }

    getName(): string {
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
    where(attribute: string | string[], value: any,
        compareAs: CollectionComparator
    ): Collection {
        let answer = new Collection(
            this.name + '[' + attribute + ' ' + compareAs + ' ' + value + ']'
        );

        this._models.forEach((model: Model, key: string) => {

            if (typeof attribute == "string") {
                if (this.compareAttribute(model.getAttribute(attribute), value, compareAs)) {
                    answer.addModel(model, key);
                }
            } else {
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

    private compareAttribute(value: any, checkWith: any,
        compareAs: CollectionComparator
    ): boolean {
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

    whereIn(attribute: string, values: any[], compareAs: "like" | "equal"): Collection {
        let answer = new Collection();

        return answer;
    }

    removeModel(key: string): Model;
    removeModel(model: Model): Model;
    removeModel(what: string | Model): Model | null {
        //Trying to delete by model, expensive!
        if (what instanceof Model) {
            this._models.forEach((model, key) => {
                if (model == what) {
                    this._models.delete(key);
                    this.emit("modelRemoved",what);
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
                this.emit("modelRemoved",m)
                return m as Model;
            } else {
                return null;
            }
        }

    }

    addModel(model: Model, key?: string): string {
        let rKey = key == undefined ? "CID-" + this.innerCount++ : key;
        this._models.set(rKey, model);
        this.emit("modelAdded", model);
        return rKey;
    }

    getModel(key: string): Model | null {
        if (this._models.has(key)) {
            return this._models.get(key) as Model;
        }
        return null;
    }

    getAllModels(): Map<string, Model> {
        let nMap = new Map();

        this._models.forEach((model: Model, key: string) => {
            nMap.set(key, model);
        });

        return nMap;
    }

    /**
     * 
     * @param model 
     */
    hasModel(model: Model) {
        return !(Array.from(this._models.values()).indexOf(model) < 0);
    }
}