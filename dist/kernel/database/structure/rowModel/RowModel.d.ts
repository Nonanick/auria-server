import { Model } from "../../../model/Model";
import { Table } from "../table/Table";
import { RowObject } from "./RowObject";
import { ObjectRepository } from "../../object/ObjectRepository";
import { SystemUser } from "../../../security/SystemUser";
export declare type SQLInsertResult = {
    affectedRows: number;
    insertId: number;
    message: string;
};
export declare class RowModel extends Model {
    static objectRepository: ObjectRepository;
    private table;
    private rowModelId;
    private objectEquivalent;
    private __insertLock;
    constructor(table: Table, id?: any);
    generateObjectEquivalent(): Promise<RowObject>;
    getId(): any;
    setId(id: any): this;
    getTable(): Table;
    save(user: SystemUser): Promise<boolean>;
    private insert;
    private update;
    delete(user: SystemUser): Promise<boolean>;
    isLocked(): boolean;
    getLockTime(): number;
    lock(): void;
    unlock(): void;
    getOwner(): number;
    getGroup(): void;
    getObject(): RowObject;
    seObject(object: RowObject): RowModel;
    /**
     * [RowModel] Set Attribute
     * -------------------------
     * !! ASYNC function
     * Listen to "update" event to actually catche the end of function
     * The base Model function is not async therefore can't be overdriven
     * by ans async function
     *
     * @param attrName
     * @param attrValue
     * @param trigger
     */
    setAttribute(attrName: string, attrValue: any, trigger?: boolean): RowModel;
    /**
     * [RowModel] Set Attribute
     * -------------------------
     * !! ASYNC function
     * Listen to "update" event to actually catche the end of function
     * The base Model function is not async therefore can't be overdriven
     * by ans async function
     *
     * @param attrs
     * @param trigger
     */
    setAttribute(attrs: {
        [field: string]: any;
    }, trigger?: boolean): RowModel;
}
