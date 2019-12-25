import { Model } from "aurialib2";
import { Table } from "../table/Table";
import { RowObject } from "./RowObject";
import { ObjectRepository } from "../../object/ObjectRepository";
import { SystemUser } from "../../../security/SystemUser";
import { DataTypeContext } from "../dataType/DataTypeContext";
import { Column } from "../column/Column";

export type SQLInsertResult = {
    affectedRows: number;
    insertId: number;
    message: string;
};

export class RowModel extends Model {

    public static objectRepository: ObjectRepository;

    private table: Table;
    private rowModelId: any;
    private objectEquivalent: RowObject;

    private __insertLock = false;

    constructor(table: Table, id?: any) {
        super();
        this.rowModelId = id;
        this.table = table;

        //this.objectRepository = table.getSystem().getObjectRepository();

    }

    public async generateObjectEquivalent() {
        let promise = RowModel.objectRepository.getObjectEquivalent(this)
        .then((obj) => {
            console.log("[RowModel] Object equivalent found!");
            this.objectEquivalent = obj;
            return this.objectEquivalent;
        });
        promise.catch((err) => {
            console.error("[RowModel] Failed to get object equivalent of RowModel! ", err);
        });

        return promise;
    }

    public getId(): any {
        return this.rowModelId;
    }

    public setId(id: any) {
        if (this.rowModelId == null)
            this.rowModelId = id;
        else
            console.error("[RowModel] Trying to override a model ID, not possible!");

        return this;
    }

    public getTable(): Table {
        return this.table;
    }

    public save(user: SystemUser): Promise<boolean> {
        let savePromise = new Promise<boolean>(
            async (resolve, reject) => {
                if (this.getId() != null) {
                    try {
                        resolve(await this.update());
                    } catch (err) {
                        reject("[RowModel] Failed to update in database!");
                    }
                } else {
                    resolve(await this.insert(user));
                }
            }
        );

        return savePromise;
    }

    private async insert(user: SystemUser): Promise<boolean> {

        if (!this.__insertLock) {
            let insertPromise = new Promise<boolean>(
                (resolve, reject) => {

                    this.__insertLock = true;

                    let conn = this.table.getSystem().getSystemConnection();

                    let colNames = this.getAttributesName();
                    let questionArr: string[] = [];
                    let values: any[] = [];

                    colNames.forEach((col) => {
                        values.push(this.getAttribute(col));
                        questionArr.push("?");
                    });

                    let queryString: string =
                        " INSERT INTO " + this.table.table +
                        " (" + colNames.map(v => { return "`" + v + "`"; }).join(",") + ") " +
                        " VALUES (" + questionArr.join(',') + ")";
                    conn.raw(
                        queryString
                    ).then((res) => {
                        //this.objectEquivalent.setOwner(user);
                        this.rowModelId = res.insertId;
                        this.emit("create", this.rowModelId);
                        resolve(true);
                    }).catch((err) => {
                        console.error("[RowModel] Failed to execute insert function, SQL Error", err);
                        this.__insertLock = false;
                        reject("[RowModel] SQL Failed to insert!");
                    });
                }
            );
            return insertPromise;
        } else {
            return false;
        }
    }

    private async update(): Promise<boolean> {
        let updatePromise = new Promise<boolean>(
            (resolve, reject) => {
                let conn = this.table.getSystem().getSystemConnection();
                let changedAttr = this.attributes.getChangedAttributes();
                this.attributes.resetChangedAttributes();

                let colName: string[] = [];
                let colValue: any[] = [];

                this.table.getColumns().then(() => {

                    changedAttr.forEach((attr) => {
                        let col = this.table.getColumn(attr);
                        if (col != null) {
                            colName.push("`" + col.column + "` = ?");
                            // # - @todo Fancy things in data safety here
                            colValue.push(this.getAttribute(attr));
                        }
                    });

                    colValue.push(this.getId());

                    let queryString: string =
                        "UPDATE "
                        + this.table.table +
                        " SET " + colName.join(" , ") +
                        " WHERE `" + this.table.distinctiveColumn + "` = ?";

                    console.log("[RowModel] Update query: ", queryString);

                    conn.raw(
                        queryString
                    ).then((res) => {
                        console.log("[RowModel] Update result: ", res);
                        this.emit("update", { changedAttr: changedAttr });
                        resolve(true);
                    }).catch((err) => {
                        console.error("[RowModel] Failed to execute update function, SQL Error", err);
                        reject("[RowModel] SQL Failed to update!");
                    });
                });
            }
        );

        return updatePromise;
    }

    public async delete(user: SystemUser): Promise<boolean> {
        let deletePromise = new Promise<boolean>(
            (resolve, reject) => {
                this.emit("delete");
                resolve(false);
            }
        );

        return deletePromise;
    }

    public isLocked(): boolean {
        return false;
    }

    public getLockTime(): number {
        return this.objectEquivalent.getLockTime()
    }

    public lock() {

    }

    public unlock() {

    }

    public getOwner() {
        return this.objectEquivalent.getOwner();
    }

    public getGroup() {

    }

    public getObject(): RowObject {
        return this.objectEquivalent;
    }

    public seObject(object: RowObject): RowModel {
        if (this.objectEquivalent == null) {
            this.objectEquivalent = object;
        } else {
            console.error("[RowModel] Model already associated with an object equivalent!");
        }

        return this;
    }

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
    public setAttribute(attrName: string, attrValue: any, trigger?: boolean): RowModel;
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
    public setAttribute(attrs: { [field: string]: any }, trigger?: boolean): RowModel;
    public setAttribute(attrsOrName: { [field: string]: any } | string, triggerOrValue: boolean | any, trigger?: boolean): RowModel {
        // # - Used as (attributeName, value, trigger), route to ({ attr : value }, trigger)
        if (typeof attrsOrName == "string") {
            let at: any = {};
            at[attrsOrName] = triggerOrValue;
            return this.setAttribute(at, trigger);
        }

        for (var attr in attrsOrName) {
            if (attrsOrName.hasOwnProperty(attr)) {

                let columnName = attr;
                let column = this.table.getColumn(columnName);

                if (column == null) {
                    console.error("[RowModel] Trying to set an attribute that is not present in this table!", "\nAttr: ", attr);
                    /*throw new Error("[RowModel] Trying to set an attribute that is not present in this table!\nAttr: " + attr);*/
                    column = new Column(this.table.getSystem(), this.table, columnName);
                    column.setDataType("RowDescription");
                }

                let rawValue = attrsOrName[attr];
                let dataType = column!.getDataType();

                let context: DataTypeContext = {
                    system: this.table.getSystem(),
                    table: this.table,
                    column: column as Column
                };
                //let value = dataType.parseValueToDatabase(rawValue, context);
                attrsOrName[attr] = rawValue;
                console.log(context, dataType);
            }
        }

        super.setAttribute(attrsOrName, true);

        return this;
    }
}