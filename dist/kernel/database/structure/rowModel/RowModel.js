"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aurialib2_1 = require("aurialib2");
const Column_1 = require("../column/Column");
class RowModel extends aurialib2_1.Model {
    constructor(table, id) {
        super();
        this.__insertLock = false;
        this.rowModelId = id;
        this.table = table;
        //this.objectRepository = table.getSystem().getObjectRepository();
    }
    generateObjectEquivalent() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getId() {
        return this.rowModelId;
    }
    setId(id) {
        if (this.rowModelId == null)
            this.rowModelId = id;
        else
            console.error("[RowModel] Trying to override a model ID, not possible!");
        return this;
    }
    getTable() {
        return this.table;
    }
    save(user) {
        let savePromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.getId() != null) {
                try {
                    resolve(yield this.update());
                }
                catch (err) {
                    reject("[RowModel] Failed to update in database!");
                }
            }
            else {
                resolve(yield this.insert(user));
            }
        }));
        return savePromise;
    }
    insert(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.__insertLock) {
                let insertPromise = new Promise((resolve, reject) => {
                    this.__insertLock = true;
                    let conn = this.table.getSystem().getSystemConnection();
                    let colNames = this.getAttributesName();
                    let questionArr = [];
                    let values = [];
                    colNames.forEach((col) => {
                        values.push(this.getAttribute(col));
                        questionArr.push("?");
                    });
                    let queryString = " INSERT INTO " + this.table.table +
                        " (" + colNames.map(v => { return "`" + v + "`"; }).join(",") + ") " +
                        " VALUES (" + questionArr.join(',') + ")";
                    conn.raw(queryString).then((res) => {
                        //this.objectEquivalent.setOwner(user);
                        this.rowModelId = res.insertId;
                        this.emit("create", this.rowModelId);
                        resolve(true);
                    }).catch((err) => {
                        console.error("[RowModel] Failed to execute insert function, SQL Error", err);
                        this.__insertLock = false;
                        reject("[RowModel] SQL Failed to insert!");
                    });
                });
                return insertPromise;
            }
            else {
                return false;
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            let updatePromise = new Promise((resolve, reject) => {
                let conn = this.table.getSystem().getSystemConnection();
                let changedAttr = this.attributes.getChangedAttributes();
                this.attributes.resetChangedAttributes();
                let colName = [];
                let colValue = [];
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
                    let queryString = "UPDATE "
                        + this.table.table +
                        " SET " + colName.join(" , ") +
                        " WHERE `" + this.table.distinctiveColumn + "` = ?";
                    console.log("[RowModel] Update query: ", queryString);
                    conn.raw(queryString).then((res) => {
                        console.log("[RowModel] Update result: ", res);
                        this.emit("update", { changedAttr: changedAttr });
                        resolve(true);
                    }).catch((err) => {
                        console.error("[RowModel] Failed to execute update function, SQL Error", err);
                        reject("[RowModel] SQL Failed to update!");
                    });
                });
            });
            return updatePromise;
        });
    }
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let deletePromise = new Promise((resolve, reject) => {
                this.emit("delete");
                resolve(false);
            });
            return deletePromise;
        });
    }
    isLocked() {
        return false;
    }
    getLockTime() {
        return this.objectEquivalent.getLockTime();
    }
    lock() {
    }
    unlock() {
    }
    getOwner() {
        return this.objectEquivalent.getOwner();
    }
    getGroup() {
    }
    getObject() {
        return this.objectEquivalent;
    }
    seObject(object) {
        if (this.objectEquivalent == null) {
            this.objectEquivalent = object;
        }
        else {
            console.error("[RowModel] Model already associated with an object equivalent!");
        }
        return this;
    }
    setAttribute(attrsOrName, triggerOrValue, trigger) {
        // # - Used as (attributeName, value, trigger), route to ({ attr : value }, trigger)
        if (typeof attrsOrName == "string") {
            let at = {};
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
                    column = new Column_1.Column(this.table.getSystem(), this.table, columnName);
                    column.setDataType("RowDescription");
                }
                let rawValue = attrsOrName[attr];
                let dataType = column.getDataType();
                let context = {
                    system: this.table.getSystem(),
                    table: this.table,
                    column: column
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
exports.RowModel = RowModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93TW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9yb3dNb2RlbC9Sb3dNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlDQUFrQztBQU1sQyw2Q0FBMEM7QUFRMUMsTUFBYSxRQUFTLFNBQVEsaUJBQUs7SUFVL0IsWUFBWSxLQUFZLEVBQUUsRUFBUTtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQUhKLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBSXpCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLGtFQUFrRTtJQUV0RSxDQUFDO0lBRVksd0JBQXdCOztZQUNqQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDO2lCQUNoRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25GLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztLQUFBO0lBRU0sS0FBSztRQUNSLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSyxDQUFDLEVBQU87UUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUk7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