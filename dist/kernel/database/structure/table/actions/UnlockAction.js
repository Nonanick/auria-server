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
const TableAction_1 = require("../TableAction");
class UnlockAction extends TableAction_1.TableAction {
    constructor(table) {
        super(UnlockAction.ActionName, table);
    }
    apply() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.UnlockAction = UnlockAction;
UnlockAction.ActionName = "unlock";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrQWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvdGFibGUvYWN0aW9ucy9VbmxvY2tBY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxnREFBNkM7QUFHN0MsTUFBYSxZQUFhLFNBQVEseUJBQVc7SUFJekMsWUFBWSxLQUFhO1FBQ3JCLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFWSxLQUFLOztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7O0FBVkwsb0NBWUM7QUFWaUIsdUJBQVUsR0FBWSxRQUFRLENBQUMifQ==