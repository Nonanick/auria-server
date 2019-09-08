"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TableAction_1 = require("../TableAction");
class CreateAction extends TableAction_1.TableAction {
    constructor(table) {
        super(CreateAction.ActionName, table);
    }
    apply() {
        if (this.actionPromise == null) {
            this.actionPromise = new Promise((resolve, reject) => {
                let conn = this.table.getSystem().getSystemConnection();
                for (var rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                    let rowModel = this.rows[rowIndex];
                    let colNames = rowModel.getAttributesName();
                    let questionArr = [];
                    let values = [];
                    colNames.forEach((col) => {
                        values.push(rowModel.getAttribute(col));
                        questionArr.push("?");
                    });
                    let queryString = " INSERT INTO " + this.table.table +
                        " (" + colNames.map(v => { return "`" + v + "`"; }).join(",") + ") " +
                        " VALUES (" + questionArr.join(',') + ")";
                    conn.query(queryString, values).then((res) => {
                        rowModel.setId(res.insertId);
                        rowModel.emit("create", res.insertId);
                        resolve(true);
                    }).catch();
                }
            });
        }
        return this.actionPromise;
    }
}
CreateAction.ActionName = "create";
exports.CreateAction = CreateAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlQWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvdGFibGUvYWN0aW9ucy9DcmVhdGVBY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBNkM7QUFJN0MsTUFBYSxZQUFhLFNBQVEseUJBQVc7SUFJekMsWUFBWSxLQUFZO1FBQ3BCLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxLQUFLO1FBRVIsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksT0FBTyxDQUM1QixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFFaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUV4RCxLQUFLLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUU7b0JBQzVELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRW5DLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUM1QyxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7b0JBQy9CLElBQUksTUFBTSxHQUFVLEVBQUUsQ0FBQztvQkFFdkIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO3dCQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDMUIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxXQUFXLEdBQ1gsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSzt3QkFDbEMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUk7d0JBQ3BFLFdBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDOUMsSUFBSSxDQUFDLEtBQUssQ0FDTixXQUFXLEVBQ1gsTUFBTSxDQUNULENBQUMsSUFBSSxDQUFFLENBQUMsR0FBcUIsRUFBRSxFQUFFO3dCQUM5QixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RCLENBQUMsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNmO1lBQ0wsQ0FBQyxDQUNKLENBQUM7U0FDTDtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDOztBQTVDYSx1QkFBVSxHQUFXLFFBQVEsQ0FBQztBQUZoRCxvQ0FnREMifQ==