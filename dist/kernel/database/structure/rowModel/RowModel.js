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
const Model_1 = require("../../../model/Model");
const Column_1 = require("../column/Column");
class RowModel extends Model_1.Model {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93TW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS9yb3dNb2RlbC9Sb3dNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsZ0RBQTZDO0FBTTdDLDZDQUEwQztBQVExQyxNQUFhLFFBQVMsU0FBUSxhQUFLO0lBVS9CLFlBQVksS0FBWSxFQUFFLEVBQVE7UUFDOUIsS0FBSyxFQUFFLENBQUM7UUFISixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUl6QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixrRUFBa0U7SUFFdEUsQ0FBQztJQUVZLHdCQUF3Qjs7WUFDakMsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQztpQkFDaEUsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO2dCQUM1QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQywwREFBMEQsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUM7S0FBQTtJQUVNLEtBQUs7UUFDUixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLEtBQUssQ0FBQyxFQUFPO1FBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJO1lB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