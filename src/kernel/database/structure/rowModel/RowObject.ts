import { EventEmitter } from "events";
import { RowModel } from "./RowModel";
import { SystemUser } from "../../../security/SystemUser";

type ObjectRowData = {
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

export const ObjectAttributes = [
    "pkField",
    "tableId",
    "lockTime",
    "lockUser",
    "owner",
    "ownerRole",
    "active",
    "version",
    "nextVersion",
    "createdAt",
    "updatedAt",
    "deletedAt"
] as const;

export type ObjectAttributesType = typeof ObjectAttributes[number];

export class RowObject extends EventEmitter {


    /**
     * Object ID
     * ----------
     */
    private _id: number | undefined;

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

    private rowModelUpdateListener = () => {

    };

    private rowModelDeleteListener = () => {

    };

    constructor(rowModel: RowModel, id?: number) {
        super();
        this.rowModel = rowModel;

        this.rowModel.addListener("update", this.rowModelUpdateListener);
        this.rowModel.addListener("delete", this.rowModelDeleteListener);

        this._id = id;
    }

    public setInfo(info: ObjectRowData) {
        this.table = info.table;
        this.tableId = info.table_id;
        this.pkField = info.pk_field;

        this.lockTime = info.lock_time;
        this.lockUser = info.lock_user;

        this.currentVersion = info.current_version;
        this.nextVersion = info.next_version;

        this.active = info.active;

        this.owner = info.owner;
        this.ownerRole = info.owner_role;

        this.createdAt = info.created_at;
        this.updatedAt = info.updated_at;

        return this;
    }

    public setAttr(name: ObjectAttributesType, value: any) {
        (this as any)[name] = value;
        return this;
    }

    public setOwner(user: SystemUser) {
        this.owner = user.getId();
    }

    public getOwner(): number {
        return this.owner;
    }

    public getLockTime() {
        return this.lockTime;
    }

    public async save() {
        if (this._id == null) {
            return this.insert();
        } else {
            return this.update();
        }
    }

    private async insert() {
        let insertPromise = new Promise<boolean>(
            (resolve, reject) => {

                let conn = this.rowModel.getTable().getSystem().getSystemConnection();

                conn.raw(
                    "INSERT INTO object \
                ( `table`, `pk_field`, `table_id`, `active`, `owner`, `owner_role`, \
                `current_version`, `next_version`, `lock_time`, `lock_user`, \
                `created_at`, `updated_at`, `deleted_at` ) \
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    
                        this.table,
                        this.pkField,
                        this.tableId,
                        this.active,
                        this.owner,
                        this.ownerRole,
                        this.currentVersion,
                        this.nextVersion,
                        this.lockTime,
                        this.lockUser,
                        new Date(this.createdAt),
                        new Date(this.updatedAt),
                        "null"
                    ).then((res) => {
                        this._id = res.insertId;
                        resolve(true);
                    }).catch((err) => {
                        console.error("[RowObject] SQL Error while inserting object into table: ", err);
                        reject("[RowObject] Failed to update this row object reference");
                    });
            }
        );
        return insertPromise;
    }

    private async update() {

    }
}