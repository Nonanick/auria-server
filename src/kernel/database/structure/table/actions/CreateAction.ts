import { TableAction } from "../TableAction";
import { Table } from "../Table";
import { SQLInsertResult } from "../../rowModel/RowModel";

export class CreateAction extends TableAction {

    public static ActionName: string = "create";

    constructor(table: Table) {
        super(CreateAction.ActionName, table);
    }

    public apply(): Promise<boolean> {

        if (this.actionPromise == null) {
            this.actionPromise = new Promise<boolean>(
                (resolve, reject) => {

                    let conn = this.table.getSystem().getSystemConnection();
                    
                    for (var rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                        let rowModel = this.rows[rowIndex];

                        let colNames = rowModel.getAttributesName();
                        let questionArr: string[] = [];
                        let values: any[] = [];

                        colNames.forEach((col) => {
                            values.push(rowModel.getAttribute(col));
                            questionArr.push("?");
                        });

                        let queryString: string =
                            " INSERT INTO " + this.table.table +
                            " (" + colNames.map(v => { return "`" + v + "`"; }).join(",") + ") " +
                            " VALUES (?)";
                        conn.raw(
                            queryString,
                            values
                        ).then( (res : SQLInsertResult) => {
                            rowModel.setId(res.insertId);
                            rowModel.emit("create", res.insertId);
                                resolve(true);
                        } ).catch();
                    }
                }
            );
        }

        return this.actionPromise;
    }

}