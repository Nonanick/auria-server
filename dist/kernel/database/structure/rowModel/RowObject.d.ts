/// <reference types="node" />
import { EventEmitter } from "events";
import { RowModel } from "./RowModel";
import { SystemUser } from "../../../security/SystemUser";
declare type ObjectRowData = {
    table: string;
    pk_field: string;
    table_id: string;
    active: number;
    owner: number;
    owner_role: number;
    current_version: number;
    next_version: number;
    lock_time: number;
    lock_user: number;
    created_at: number;
    updated_at: number;
    deleted_at?: number;
};
export declare const ObjectAttributes: readonly ["pkField", "tableId", "lockTime", "lockUser", "owner", "ownerRole", "active", "version", "nextVersion", "createdAt", "updatedAt", "deletedAt"];
export declare type ObjectAttributesType = typeof ObjectAttributes[number];
export declare class RowObject extends EventEmitter {
    /**
     * Object ID
     * ----------
     */
    private _id;
    /**
     * RowModel
     * ---------
     */
    protected rowModel: RowModel;
    /**
     * Table Name
     * ------------
     *
     * Auria name of the table ( not the SQL one!)
     */
    protected table: string;
    /**
     * Table ID
     * ---------
     *
     * ID of the object in its original table
     */
    protected tableId: string;
    /**
     * PK Field
     * ---------
     *
     * Usually matches the [Table.distictiveColumn] value
     */
    protected pkField: string;
    /**
     * Lock Time
     * ----------
     *
     * DateTime o the last lock request
     */
    protected lockTime: number;
    /**
     * Lock User
     * ----------
     *
     * ID of the user responsible for the last request
     */
    protected lockUser: number;
    /**
     * Owner
     * ------
     *
     * Owner ID of this object
     *
     * Ownership usually matches the one who created the row,
     * but can be taken by system master o administrators
     */
    protected owner: number;
    /**
     * Owner Role
     * -----------
     *
     * Owner role of this object
     *
     * Just like file "group" it sets the role that can access this
     * row with ownership privileges
     */
    protected ownerRole: number;
    /**
     * Active
     * -------
     *
     * Wether this row should be taken into account
     */
    protected active: number;
    /**
     * Version
     * --------
     *
     * Version control of this row
     */
    protected currentVersion: number;
    /**
     * Next Version
     * ------------
     *
     * Retun the next version number
     */
    protected nextVersion: number;
    /**
     * [DateTime]: Created At
     * ----------------------
     *
     * DateTime of the creation of this object
     */
    protected createdAt: number;
    /**
     * [DateTime]: Updated At
     * ----------------------
     *
     * DateTime of the last edition of this object
     */
    protected updatedAt: number;
    /**
     * [DateTime]: Deleted At
     * ----------------------
     *
     * DateTime of the deletion of this object
     */
    protected deletedAt: number;
    private rowModelUpdateListener;
    private rowModelDeleteListener;
    constructor(rowModel: RowModel, id?: number);
    setInfo(info: ObjectRowData): this;
    setAttr(name: ObjectAttributesType, value: any): this;
    setOwner(user: SystemUser): void;
    getOwner(): number;
    getLockTime(): number;
    save(): Promise<boolean | void>;
    private insert;
    private update;
}
export {};
