"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class TableAction extends events_1.EventEmitter {
    constructor(name, table) {
        super();
        this.rowsLocked = false;
        this.name = name;
        this.rows = [];
        this.table = table;
    }
    addRow(...rows) {
        if (!this.rowsLocked)
            this.rows = this.rows.concat(rows);
        return this;
    }
    lockRows() {
        this.rowsLocked = true;
        return this;
    }
}
exports.TableAction = TableAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMva2VybmVsL2RhdGFiYXNlL3N0cnVjdHVyZS90YWJsZS9UYWJsZUFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUl0QyxNQUFzQixXQUFZLFNBQVEscUJBQVk7SUFZbEQsWUFBWSxJQUFhLEVBQUUsS0FBYTtRQUNwQyxLQUFLLEVBQUUsQ0FBQztRQUhKLGVBQVUsR0FBYSxLQUFLLENBQUM7UUFJakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQUcsSUFBaUI7UUFDOUIsSUFBRyxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FJSjtBQWpDRCxrQ0FpQ0MifQ==