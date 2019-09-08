"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TableAccess {
    constructor(user, table, actions) {
        this.table = table;
        this.user = user;
    }
    newQuery() {
        let q = this.table.newQuery();
        return q;
    }
}
exports.TableAccess = TableAccess;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVBY2Nlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL3NlY3VyaXR5L2RhdGEvVGFibGVBY2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxNQUFhLFdBQVc7SUFRcEIsWUFBWSxJQUFpQixFQUFFLEtBQWEsRUFBRSxPQUF1QjtRQUNqRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFHOUIsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0NBQ0o7QUFuQkQsa0NBbUJDIn0=