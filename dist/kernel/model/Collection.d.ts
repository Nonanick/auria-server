/// <reference types="node" />
import { EventEmitter } from "events";
import { Model } from "./Model";
export declare type CollectionComparator = "like" | "equal" | "lesser" | "greater" | ">" | "<" | "<=" | ">=" | "<>" | "!=";
export declare type CollectionEvents = "modelAdded" | "modelRemoved";
export declare class Collection extends EventEmitter {
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
    private innerCount;
    /**
     * Name
     * ------
     *
     * Name of this collection
     */
    protected name: string;
    constructor(name?: string);
    /**
     * Set Name
     * --------
     *
     * Defines the name of this collection
     *
     * @param name
     */
    setName(name: string): void;
    getName(): string;
    /**
     * Size
     * -----
     *
     * Alias to getAllModels().size()
     */
    size(): number;
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
    where(attribute: string | string[], value: any, compareAs: CollectionComparator): Collection;
    private compareAttribute;
    whereIn(attribute: string, values: any[], compareAs: "like" | "equal"): Collection;
    removeModel(key: string): Model;
    removeModel(model: Model): Model;
    addModel(model: Model, key?: string): string;
    getModel(key: string): Model | null;
    getAllModels(): Map<string, Model>;
    /**
     *
     * @param model
     */
    hasModel(model: Model): boolean;
}
