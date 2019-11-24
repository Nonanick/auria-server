"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
                    conn.query(queryString, values).then((res) => {
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
                    conn.query(queryString, colValue).then((res) => {
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
                let value = dataType.parseValueToDatabase(rawValue, context);
                attrsOrName[attr] = value;
            }
        }
        super.setAttribute(attrsOrName, true);
        return this;
    }
}
exports.RowModel = RowModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93TW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9yb3dNb2RlbC9Sb3dNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQWtDO0FBTWxDLDZDQUEwQztBQVExQyxNQUFhLFFBQVMsU0FBUSxpQkFBSztJQVUvQixZQUFZLEtBQVksRUFBRSxFQUFRO1FBQzlCLEtBQUssRUFBRSxDQUFDO1FBSEosaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsa0VBQWtFO0lBRXRFLENBQUM7SUFFWSx3QkFBd0I7O1lBQ2pDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUM7aUJBQ2hFLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztnQkFDNUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsMERBQTBELEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLE9BQU8sQ0FBQztRQUNuQixDQUFDO0tBQUE7SUFFTSxLQUFLO1FBQ1IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSxLQUFLLENBQUMsRUFBTztRQUNoQixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSTtZ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