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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93T2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvcm93TW9kZWwvUm93T2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXNDO0FBb0J6QixRQUFBLGdCQUFnQixHQUFHO0lBQzVCLFNBQVM7SUFDVCxTQUFTO0lBQ1QsVUFBVTtJQUNWLFVBQVU7SUFDVixPQUFPO0lBQ1AsV0FBVztJQUNYLFFBQVE7SUFDUixTQUFTO0lBQ1QsYUFBYTtJQUNiLFdBQVc7SUFDWCxXQUFXO0lBQ1gsV0FBVztDQUNMLENBQUM7QUFJWCxNQUFhLFNBQVUsU0FBUSxxQkFBWTtJQStIdkMsWUFBWSxRQUFrQixFQUFFLEVBQVc7UUFDdkMsS0FBSyxFQUFFLENBQUM7UUFUSiwyQkFBc0IsR0FBRyxHQUFHLEVBQUU7UUFFdEMsQ0FBQyxDQUFDO1FBRU0sMkJBQXNCLEdBQUcsR0FBRyxFQUFFO1FBRXRDLENBQUMsQ0FBQztRQUlFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFtQjtRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUU3QixJQUFJLENBQUMsUUFB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