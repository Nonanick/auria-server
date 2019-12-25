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
const events_1 = require("events");
exports.ObjectAttributes = [
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
];
class RowObject extends events_1.EventEmitter {
    constructor(rowModel, id) {
        super();
        this.rowModelUpdateListener = () => {
        };
        this.rowModelDeleteListener = () => {
        };
        this.rowModel = rowModel;
        this.rowModel.addListener("update", this.rowModelUpdateListener);
        this.rowModel.addListener("delete", this.rowModelDeleteListener);
        this._id = id;
    }
    setInfo(info) {
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
    setAttr(name, value) {
        this[name] = value;
        return this;
    }
    setOwner(user) {
        this.owner = user.getId();
    }
    getOwner() {
        return this.owner;
    }
    getLockTime() {
        return this.lockTime;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._id == null) {
                return this.insert();
            }
            else {
                return this.update();
            }
        });
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            let insertPromise = new Promise((resolve, reject) => {
                let conn = this.rowModel.getTable().getSystem().getSystemConnection();
                conn.raw("INSERT INTO object \
                ( `table`, `pk_field`, `table_id`, `active`, `owner`, `owner_role`, \
                `current_version`, `next_version`, `lock_time`, `lock_user`, \
                `created_at`, `updated_at`, `deleted_at` ) \
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", this.table, this.pkField, this.tableId, this.active, this.owner, this.ownerRole, this.currentVersion, this.nextVersion, this.lockTime, this.lockUser, new Date(this.createdAt), new Date(this.updatedAt), "null").then((res) => {
                    this._id = res.insertId;
                    resolve(true);
                }).catch((err) => {
                    console.error("[RowObject] SQL Error while inserting object into table: ", err);
                    reject("[RowObject] Failed to update this row object reference");
                });
            });
            return insertPromise;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.RowObject = RowObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93T2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvcm93TW9kZWwvUm93T2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBc0M7QUFvQnpCLFFBQUEsZ0JBQWdCLEdBQUc7SUFDNUIsU0FBUztJQUNULFNBQVM7SUFDVCxVQUFVO0lBQ1YsVUFBVTtJQUNWLE9BQU87SUFDUCxXQUFXO0lBQ1gsUUFBUTtJQUNSLFNBQVM7SUFDVCxhQUFhO0lBQ2IsV0FBVztJQUNYLFdBQVc7SUFDWCxXQUFXO0NBQ0wsQ0FBQztBQUlYLE1BQWEsU0FBVSxTQUFRLHFCQUFZO0lBK0h2QyxZQUFZLFFBQWtCLEVBQUUsRUFBVztRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQVRKLDJCQUFzQixHQUFHLEdBQUcsRUFBRTtRQUV0QyxDQUFDLENBQUM7UUFFTSwyQkFBc0IsR0FBRyxHQUFHLEVBQUU7UUFFdEMsQ0FBQyxDQUFDO1FBSUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQW1CO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRTdCLElBQUksQ0FBQyxRQUFR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